import type { Result, ResultRating } from '@empathyco/x-types'

export interface ResultWithPCR extends Result {
  pcrTag?: string
  rating?: ResultRating
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
  query: 'pcr-query-tags',
  general: 'pcr-general-tags',
  category: 'pcr-category-tags',
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
  } catch {
    // Error handling without logging
  }
}

function getTag(productId: string, type: 'query' | 'general' | 'category'): StoredTag | null {
  try {
    const key = STORAGE_KEYS[type]
    const storage = JSON.parse(localStorage.getItem(key) || '{}') as TagStorage
    return storage[productId] || null
  } catch {
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
      result.categories.forEach(category => {
        if (typeof category === 'string' && category !== 'Default') {
          allCategories.push(category)
        }
      })
    }
  })

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
    result.pcrTag = existingTag.tag
    taggedResults.add(productId)
    if (isFirstEight) {
      usedTagTypes.add(tagType)
    }
    return
  }

  // If no stored tag exists, create and save a new one
  switch (tagType) {
    case 'query':
      result.pcrTag = `Sales hit in "${query}"`
      saveTag(productId, `Sales hit in "${query}"`, 'query', query)
      break
    case 'category':
      if (categories.length > 0) {
        const category = categories[Math.floor(Math.random() * categories.length)]
        result.pcrTag = `Trusted Pick for "${category}"`
        saveTag(productId, `Trusted Pick for "${category}"`, 'category')
      } else {
        // Fallback to general tag if no categories available
        result.pcrTag = 'Bestseller'
        saveTag(productId, 'Bestseller', 'general')
      }
      break
    case 'general':
      result.pcrTag = 'Bestseller'
      saveTag(productId, 'Bestseller', 'general')
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
export function assignPCRTags(results: Result[], query: string): Result[] {
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

  // Phase 1: Apply stored tags and ratings to first 8 results
  for (const result of firstEightResults) {
    // Skip if result already has a BuzzFactor tag
    if (result.buzzFactorTag) continue

    const productId = String(result.id)
    const storedTags = getAllStoredTags(productId)

    // Try to apply a stored tag that doesn't conflict with used types
    for (const { type, tag } of storedTags) {
      if (type === 'query' && tag.query === query && !usedTagTypes.has('query')) {
        result.pcrTag = tag.tag
        taggedResults.add(productId)
        usedTagTypes.add('query')
        break
      } else if (type === 'category' && !usedTagTypes.has('category')) {
        result.pcrTag = tag.tag
        taggedResults.add(productId)
        usedTagTypes.add('category')
        break
      } else if (type === 'general' && !usedTagTypes.has('general')) {
        result.pcrTag = tag.tag
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
      firstFourResults.filter(r => !taggedResults.has(String(r.id)) && !r.buzzFactorTag),
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
      firstEightResults.filter(r => !taggedResults.has(String(r.id)) && !r.buzzFactorTag),
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

  // Phase 3: Apply stored tags and ratings to remaining results
  for (const result of remainingResults) {
    // Skip if result already has a BuzzFactor tag
    if (result.buzzFactorTag) continue

    if (taggedResults.size >= maxTaggedProducts) break

    const productId = String(result.id)
    const storedTags = getAllStoredTags(productId)

    // Try to apply any stored tag
    for (const { type, tag } of storedTags) {
      if (type === 'query' && tag.query === query) {
        result.pcrTag = tag.tag
        taggedResults.add(productId)
        break
      } else if (type === 'category' || type === 'general') {
        result.pcrTag = tag.tag
        taggedResults.add(productId)
        break
      }
    }
  }

  // Phase 4: Ensure 20% tags in first 50
  const first50Tagged = first50Results.filter(r => taggedResults.has(String(r.id))).length
  if (first50Tagged < first50Limit) {
    const untaggedFirst50 = shuffleArray(
      first50Results.filter(r => !taggedResults.has(String(r.id)) && !r.buzzFactorTag),
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
    const untaggedResults = shuffleArray(
      resultsCopy.filter(r => !taggedResults.has(String(r.id)) && !r.buzzFactorTag),
    )

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
