import type { Result } from '@empathyco/x-types'

export interface ResultWithBuzzFactor extends Result {
  buzzFactorTag?: string
}

/**
 * Assigns Buzz Factor tags to a percentage of search results
 * @param results - The search results to process
 * @param query - The current search query
 * @returns The results with added buzz factor tags
 */
export function assignBuzzFactorTags(results: Result[], query: string): Result[] {
  if (!results.length) return results

  // Debug: Print a sample product's full structure
  if (results.length > 0) {
    const sampleProduct = results[0]
    if (sampleProduct) {
      console.warn(
        'Sample product structure:',
        JSON.stringify({
          id: sampleProduct.id,
          name: sampleProduct.name,
          categories: sampleProduct.categories,
          collection: sampleProduct.collection,
          brand: sampleProduct.brand,
        }),
      )
    }
  }

  // If query is still empty, try to extract it from the results' tagging info
  let finalQuery = query
  if (!finalQuery && results.length > 0) {
    const firstResult = results[0]
    if (firstResult?.tagging?.click?.params?.q) {
      finalQuery = String(firstResult.tagging.click.params.q)
      console.warn(`Query was empty, extracted from tagging: "${finalQuery}"`)
    }
  }

  console.warn(
    `Assigning buzz factor tags for ${results.length} results with query "${finalQuery}"`,
  )

  // Make sure we work with the original results for proper reactivity
  const resultsCopy = [...results]

  // Calculate maximum 10% of the results for all tags combined
  const maxTaggedProducts = Math.max(2, Math.floor(results.length * 0.1)) // Ensure at least 2 tags
  console.warn(`Maximum tagged products (10%): ${maxTaggedProducts}`)

  // We have 3 tag types, each should get approximately 1/3 of the maxTaggedProducts
  const tagsPerGroup = Math.max(1, Math.floor(maxTaggedProducts / 3))
  console.warn(`Tags per group (1/3 of max): ${tagsPerGroup}`)

  // Get category names from the results (handling nested array structure correctly)
  const allCategories: string[] = []
  resultsCopy.forEach(result => {
    // Check if the result has categories field and it's an array
    if (result.categories && Array.isArray(result.categories)) {
      // Categories is an array of arrays, each with a single string: [["midi"], ["shirt"], ["red"]]
      result.categories.forEach(categoryArray => {
        if (Array.isArray(categoryArray) && categoryArray.length > 0) {
          // Add the first item from each inner array, but exclude "Default"
          if (typeof categoryArray[0] === 'string' && categoryArray[0] !== 'Default') {
            allCategories.push(categoryArray[0])
          }
        } else if (typeof categoryArray === 'string' && categoryArray !== 'Default') {
          // Handle case where categories might be a flat array of strings, exclude "Default"
          allCategories.push(categoryArray)
        }
      })
    }
  })

  // Deduplicate categories
  const categories = Array.from(new Set(allCategories))
  console.warn(`Found ${categories.length} unique categories (excluding "Default"):`, categories)

  // If no categories found from categories field, fall back to collection
  if (categories.length === 0) {
    const collectionsAsCategories = Array.from(
      new Set(
        resultsCopy
          .map(result => result.collection)
          .filter(collection => Boolean(collection) && collection !== 'Default'),
      ),
    )
    console.warn(
      `No categories found, falling back to ${collectionsAsCategories.length} collections (excluding "Default")`,
    )
    categories.push(...collectionsAsCategories)
  }

  // Predefined tag groups (each representing an equal share of the 10%)
  const tagGroups = [
    // Always show query-based tags first (if query exists)
    ...(finalQuery.trim() ? [{ tag: `Hype in "${finalQuery}"`, count: tagsPerGroup }] : []),
    // Then show non-query tags
    { tag: 'Trending now', count: tagsPerGroup },
    { tag: 'Popular in', count: tagsPerGroup, useCategory: true },
  ]

  console.warn(
    'Tag groups to apply:',
    tagGroups.map(g => g.tag),
  )

  // Track which results are already tagged
  const taggedResults = new Set<string>()
  // Track which tag types have been used in the first 8 results
  const usedTagTypes = new Set<string>()

  // Function to process a result and apply a tag
  const processResult = (
    result: Result,
    groupIndex: number,
    isFirstEight: boolean = false,
  ): boolean => {
    // Skip if already tagged
    if (taggedResults.has(String(result.id))) return false

    // Find the original result in our array
    const originalIndex = results.findIndex(r => String(r.id) === String(result.id))
    if (originalIndex === -1) return false

    const originalResult = results[originalIndex]
    if (!originalResult) return false

    const group = tagGroups[groupIndex]

    // For first 8 results, ensure we don't use the same tag type twice
    if (isFirstEight) {
      const tagType = group.useCategory
        ? 'category'
        : group.tag.includes('Hype in')
          ? 'query'
          : 'general'
      if (usedTagTypes.has(tagType)) {
        return false
      }
      usedTagTypes.add(tagType)
    }

    // For category-specific tags
    if (group.useCategory && categories.length) {
      // Get the product's categories, flattening the nested structure
      let productCategoryStrings: string[] = []

      // Extract categories directly from the product's field
      const productCategories = originalResult.categories

      if (productCategories && Array.isArray(productCategories)) {
        productCategories.forEach(category => {
          if (Array.isArray(category)) {
            if (
              category.length > 0 &&
              typeof category[0] === 'string' &&
              category[0] !== 'Default'
            ) {
              productCategoryStrings.push(category[0])
            }
          } else if (typeof category === 'string' && category !== 'Default') {
            productCategoryStrings.push(category)
          }
        })
      }

      // Filter out empty values
      productCategoryStrings = productCategoryStrings.filter(Boolean)

      // Try alternative approaches to find categories if none were found
      if (productCategoryStrings.length === 0) {
        // Try looking for embedded category information in product name
        if (originalResult.name && typeof originalResult.name === 'string') {
          const nameParts = originalResult.name.split(' ')
          if (nameParts.length > 0 && nameParts[0] !== 'Default') {
            productCategoryStrings.push(nameParts[0])
          }
        }

        // Try looking for properties that might contain category information
        const product = originalResult as unknown as Record<string, unknown>
        const possibleCategoryFields = ['type', 'group', 'category', 'className']
        for (const field of possibleCategoryFields) {
          const value = product[field]
          if (typeof value === 'string' && value !== 'Default') {
            productCategoryStrings.push(value)
          }
        }
      }

      // Skip category tags for this product if it has no valid categories
      if (productCategoryStrings.length === 0) {
        if (!originalResult.collection || originalResult.collection === 'Default') {
          return false
        }
      }

      if (productCategoryStrings.length > 0) {
        const randomIndex = Math.floor(Math.random() * productCategoryStrings.length)
        const productCategory = productCategoryStrings[randomIndex]
        if (productCategory) {
          originalResult.buzzFactorTag = `${group.tag} "${productCategory}"`
        }
      } else if (originalResult.collection && originalResult.collection !== 'Default') {
        originalResult.buzzFactorTag = `${group.tag} "${originalResult.collection}"`
      } else if (categories.length > 0) {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)]
        originalResult.buzzFactorTag = `${group.tag} "${randomCategory}"`
      } else {
        return false
      }
    } else {
      // For non-category tags
      originalResult.buzzFactorTag = group.tag
    }

    // Mark this result as tagged
    taggedResults.add(String(originalResult.id))
    return true
  }

  // First, ensure we have at least one tag in the first 4 results
  const firstFourResults = resultsCopy.slice(0, 4)
  let firstFourTagged = false
  for (let i = 0; i < firstFourResults.length && !firstFourTagged; i++) {
    for (let groupIndex = 0; groupIndex < tagGroups.length; groupIndex++) {
      if (processResult(firstFourResults[i], groupIndex, true)) {
        firstFourTagged = true
        break
      }
    }
  }

  // Then, ensure we have at least two tags in the first 8 results
  const firstEightResults = resultsCopy.slice(0, 8)
  let firstEightTagged = 0
  for (let i = 0; i < firstEightResults.length && firstEightTagged < 2; i++) {
    for (let groupIndex = 0; groupIndex < tagGroups.length; groupIndex++) {
      if (processResult(firstEightResults[i], groupIndex, true)) {
        firstEightTagged++
        break
      }
    }
  }

  // Distribute remaining tags across the rest of the results
  const remainingResults = resultsCopy.slice(8)
  let remainingTags = maxTaggedProducts - firstEightTagged
  let currentGroupIndex = 0

  for (let i = 0; i < remainingResults.length && remainingTags > 0; i++) {
    if (processResult(remainingResults[i], currentGroupIndex, false)) {
      remainingTags--
      currentGroupIndex = (currentGroupIndex + 1) % tagGroups.length
    }
  }

  console.warn(
    `Tag distribution: First 4: ${firstFourTagged ? 1 : 0}, First 8: ${firstEightTagged}, Remaining: ${maxTaggedProducts - firstEightTagged}`,
  )
  console.warn('Used tag types in first 8:', Array.from(usedTagTypes))

  return results
}
