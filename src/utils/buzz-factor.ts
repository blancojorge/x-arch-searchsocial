import type { Result } from '@empathyco/x-types'

export interface ResultWithBuzzFactor extends Result {
  buzzFactorTag?: string
}

interface StoredTag {
  tag: string
  query?: string
  timestamp?: number
}

interface TagStorage {
  [productId: string]: StoredTag
}

const STORAGE_KEYS = {
  query: 'buzz-factor-query-tags',
  general: 'buzz-factor-general-tags',
  category: 'buzz-factor-category-tags',
} as const

// Storage management functions
function saveTag(
  productId: string,
  tag: string,
  type: 'query' | 'general' | 'category',
  query?: string,
): void {
  try {
    const key = STORAGE_KEYS[type]
    const storage = JSON.parse(localStorage.getItem(key) || '{}') as TagStorage
    storage[productId] = {
      tag,
      query,
      timestamp: Date.now(),
    }
    localStorage.setItem(key, JSON.stringify(storage))
  } catch (error) {
    console.error('Error saving buzz factor tag:', error)
  }
}

function getTag(productId: string, type: 'query' | 'general' | 'category'): StoredTag | null {
  try {
    const key = STORAGE_KEYS[type]
    const storage = JSON.parse(localStorage.getItem(key) || '{}') as TagStorage
    return storage[productId] || null
  } catch (error) {
    console.error('Error getting buzz factor tag:', error)
    return null
  }
}

function getAllStoredTags(
  productId: string,
): { type: 'query' | 'general' | 'category'; tag: StoredTag }[] {
  const tags: { type: 'query' | 'general' | 'category'; tag: StoredTag }[] = []

  const queryTag = getTag(productId, 'query')
  if (queryTag) tags.push({ type: 'query', tag: queryTag })

  const categoryTag = getTag(productId, 'category')
  if (categoryTag) tags.push({ type: 'category', tag: categoryTag })

  const generalTag = getTag(productId, 'general')
  if (generalTag) tags.push({ type: 'general', tag: generalTag })

  return tags
}

// Helper functions
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function getCategoriesFromResults(results: Result[]): string[] {
  const allCategories: string[] = []

  results.forEach(result => {
    if (result.categories && Array.isArray(result.categories)) {
      result.categories.forEach(categoryArray => {
        if (Array.isArray(categoryArray) && categoryArray.length > 0) {
          if (typeof categoryArray[0] === 'string' && categoryArray[0] !== 'Default') {
            allCategories.push(categoryArray[0])
          }
        } else if (typeof categoryArray === 'string' && categoryArray !== 'Default') {
          allCategories.push(categoryArray)
        }
      })
    }
  })

  if (allCategories.length === 0) {
    const collections = Array.from(
      new Set(results.map(result => result.collection).filter(Boolean)),
    )
    allCategories.push(...collections)
  }

  return Array.from(new Set(allCategories))
}

// Tag application functions
function applyTagToResult(
  result: Result,
  tagType: 'query' | 'category' | 'general',
  query: string,
  categories: string[],
  taggedResults: Set<string>,
  usedTagTypes: Set<string>,
  isFirstEight: boolean,
): void {
  const productId = String(result.id)

  // Check if this product already has a stored tag of this type
  const existingTag = getTag(productId, tagType)
  if (existingTag) {
    result.buzzFactorTag = existingTag.tag
    taggedResults.add(productId)
    if (isFirstEight) {
      usedTagTypes.add(tagType)
    }
    return
  }

  // If no stored tag exists, create and save a new one
  switch (tagType) {
    case 'query':
      result.buzzFactorTag = `Hype in "${query}"`
      saveTag(productId, `Hype in "${query}"`, 'query', query)
      break
    case 'category':
      if (categories.length > 0) {
        // Filter out categories with years
        const validCategories = categories.filter(category => !category.match(/\d{4}/))
        if (validCategories.length > 0) {
          const category = validCategories[Math.floor(Math.random() * validCategories.length)]
          result.buzzFactorTag = `Popular in "${category}"`
          saveTag(productId, `Popular in "${category}"`, 'category')
        }
      }
      break
    case 'general':
      result.buzzFactorTag = 'Trending now'
      saveTag(productId, 'Trending now', 'general')
      break
  }

  taggedResults.add(productId)
  if (isFirstEight) {
    usedTagTypes.add(tagType)
  }
}

function getAvailableTagType(usedTagTypes: Set<string>): 'query' | 'category' | 'general' {
  if (!usedTagTypes.has('query')) return 'query'
  if (!usedTagTypes.has('category')) return 'category'
  return 'general'
}

// Main tag assignment function
export function assignBuzzFactorTags(results: Result[], query: string): Result[] {
  if (!results.length) return results

  // Make a copy of results to work with
  const resultsCopy = [...results]

  // Calculate limits
  const totalResults = resultsCopy.length
  const maxTaggedProducts = Math.floor(totalResults * 0.2)
  const first50Limit = Math.floor(50 * 0.2) // 10 tags
  const firstEightLimit = 2
  const firstFourLimit = 1

  // Initialize tracking sets
  const taggedResults = new Set<string>()
  const usedTagTypes = new Set<string>()

  // Get categories
  const categories = getCategoriesFromResults(resultsCopy)

  // Split results into sections
  const firstFourResults = resultsCopy.slice(0, 4)
  const firstEightResults = resultsCopy.slice(0, 8)
  const first50Results = resultsCopy.slice(0, 50)
  const remainingResults = resultsCopy.slice(50)

  // Phase 1: Apply stored tags to first 8 results
  for (const result of firstEightResults) {
    const productId = String(result.id)
    const storedTags = getAllStoredTags(productId)

    // Try to apply a stored tag that doesn't conflict with used types
    for (const { type, tag } of storedTags) {
      if (type === 'query' && tag.query === query && !usedTagTypes.has('query')) {
        result.buzzFactorTag = tag.tag
        taggedResults.add(productId)
        usedTagTypes.add('query')
        break
      } else if (type === 'category' && !usedTagTypes.has('category')) {
        result.buzzFactorTag = tag.tag
        taggedResults.add(productId)
        usedTagTypes.add('category')
        break
      } else if (type === 'general' && !usedTagTypes.has('general')) {
        result.buzzFactorTag = tag.tag
        taggedResults.add(productId)
        usedTagTypes.add('general')
        break
      }
    }
  }

  // Phase 2: Ensure minimum tags in first 4 and 8
  const firstFourTagged = firstFourResults.filter(r => taggedResults.has(String(r.id))).length
  if (firstFourTagged < firstFourLimit) {
    const untaggedFirstFour = shuffleArray(
      firstFourResults.filter(r => !taggedResults.has(String(r.id))),
    )
    if (untaggedFirstFour.length > 0) {
      applyTagToResult(
        untaggedFirstFour[0],
        getAvailableTagType(usedTagTypes),
        query,
        categories,
        taggedResults,
        usedTagTypes,
        true,
      )
    }
  }

  while (firstEightResults.filter(r => taggedResults.has(String(r.id))).length < firstEightLimit) {
    const untaggedFirstEight = shuffleArray(
      firstEightResults.filter(r => !taggedResults.has(String(r.id))),
    )
    if (untaggedFirstEight.length === 0) break
    applyTagToResult(
      untaggedFirstEight[0],
      getAvailableTagType(usedTagTypes),
      query,
      categories,
      taggedResults,
      usedTagTypes,
      true,
    )
  }

  // Phase 3: Apply stored tags to remaining results
  for (const result of remainingResults) {
    if (taggedResults.size >= maxTaggedProducts) break

    const productId = String(result.id)
    const storedTags = getAllStoredTags(productId)

    // Try to apply any stored tag
    for (const { type, tag } of storedTags) {
      if (type === 'query' && tag.query === query) {
        result.buzzFactorTag = tag.tag
        taggedResults.add(productId)
        break
      } else if (type === 'category' || type === 'general') {
        result.buzzFactorTag = tag.tag
        taggedResults.add(productId)
        break
      }
    }
  }

  // Phase 4: Ensure 20% tags in first 50
  const first50Tagged = first50Results.filter(r => taggedResults.has(String(r.id))).length
  if (first50Tagged < first50Limit) {
    const untaggedFirst50 = shuffleArray(
      first50Results.filter(r => !taggedResults.has(String(r.id))),
    )
    const neededTags = first50Limit - first50Tagged

    for (let i = 0; i < neededTags && i < untaggedFirst50.length; i++) {
      const result = untaggedFirst50[i]
      const tagType = ['query', 'category', 'general'][Math.floor(Math.random() * 3)] as
        | 'query'
        | 'category'
        | 'general'
      applyTagToResult(result, tagType, query, categories, taggedResults, usedTagTypes, false)
    }
  }

  // Phase 5: Distribute remaining tags
  const remainingTags = maxTaggedProducts - taggedResults.size
  if (remainingTags > 0) {
    const untaggedResults = shuffleArray(resultsCopy.filter(r => !taggedResults.has(String(r.id))))

    for (let i = 0; i < remainingTags && i < untaggedResults.length; i++) {
      const result = untaggedResults[i]
      const tagType = ['query', 'category', 'general'][Math.floor(Math.random() * 3)] as
        | 'query'
        | 'category'
        | 'general'
      applyTagToResult(result, tagType, query, categories, taggedResults, usedTagTypes, false)
    }
  }

  return resultsCopy
}
