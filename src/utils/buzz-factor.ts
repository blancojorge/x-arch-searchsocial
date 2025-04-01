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

  // If query is still empty, try to extract it from the results' tagging info
  let finalQuery = query
  if (!finalQuery && results.length > 0 && results[0].tagging?.click?.params?.q) {
    finalQuery = String(results[0].tagging.click.params.q)
    console.warn(`Query was empty, extracted from tagging: "${finalQuery}"`)
  }

  console.warn(
    `Assigning buzz factor tags for ${results.length} results with query "${finalQuery}"`,
  )

  // Make sure we work with the original results for proper reactivity
  const resultsCopy = [...results]

  // Calculate maximum 10% of the results for all tags combined
  const maxTaggedProducts = Math.max(1, Math.floor(results.length * 0.1))
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

  // Divide the results into three sections for better distribution
  const firstThird = Math.floor(results.length * 0.33) // Beginning
  const secondThird = Math.floor(results.length * 0.67) // End of middle section

  // Calculate how many tags to allocate to each section
  const firstSectionTags = Math.floor(maxTaggedProducts * 0.3) // 30% at beginning
  const middleSectionTags = Math.floor(maxTaggedProducts * 0.5) // 50% in middle
  const lastSectionTags = maxTaggedProducts - firstSectionTags - middleSectionTags // Remaining at end
  console.warn(
    `Tag distribution: Beginning: ${firstSectionTags}, Middle: ${middleSectionTags}, End: ${lastSectionTags}`,
  )

  // Create shuffled copies of each section
  const firstSection = [...resultsCopy].slice(0, firstThird).sort(() => 0.5 - Math.random())
  const middleSection = [...resultsCopy]
    .slice(firstThird, secondThird)
    .sort(() => 0.5 - Math.random())
  const lastSection = [...resultsCopy].slice(secondThird).sort(() => 0.5 - Math.random())

  console.warn(
    `Section sizes: Beginning: ${firstSection.length}, Middle: ${middleSection.length}, End: ${lastSection.length}`,
  )

  // Track which results are already tagged
  const taggedResults = new Set<string>()

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

  // Apply tags to products
  let totalTagged = 0
  let firstSectionTagged = 0
  let middleSectionTagged = 0
  let lastSectionTagged = 0

  // Function to process a result and apply a tag
  const processResult = (result: Result, groupIndex: number, sectionName: string): boolean => {
    // Skip if already tagged
    if (taggedResults.has(String(result.id))) return false

    // Find the original result in our array
    const originalIndex = results.findIndex(r => String(r.id) === String(result.id))
    if (originalIndex === -1) return false

    const group = tagGroups[groupIndex]

    // For category-specific tags
    if (group.useCategory && categories.length) {
      // Debug the product structure
      console.warn(
        `Product ${results[originalIndex].id} categories:`,
        JSON.stringify(results[originalIndex].categories),
      )

      // Get the product's categories, flattening the nested structure
      let productCategoryStrings: string[] = []

      // Extract categories directly from the product's field
      const productCategories = results[originalIndex].categories

      if (productCategories && Array.isArray(productCategories)) {
        // Log the categories before processing
        console.warn(`Raw categories for product ${results[originalIndex].id}:`, productCategories)

        productCategories.forEach(category => {
          if (Array.isArray(category)) {
            // Handle nested array: ["category"], exclude "Default"
            if (
              category.length > 0 &&
              typeof category[0] === 'string' &&
              category[0] !== 'Default'
            ) {
              productCategoryStrings.push(category[0])
            }
          } else if (typeof category === 'string' && category !== 'Default') {
            // Handle string directly, exclude "Default"
            productCategoryStrings.push(category)
          }
        })
      }

      // Filter out empty values
      productCategoryStrings = productCategoryStrings.filter(Boolean)
      console.warn(
        `Extracted categories for product ${results[originalIndex].id} (excluding "Default"):`,
        productCategoryStrings,
      )

      // Try alternative approaches to find categories if none were found
      if (productCategoryStrings.length === 0) {
        // Try looking for embedded category information in product name
        if (typeof results[originalIndex].name === 'string') {
          const nameParts = results[originalIndex].name.split(' ')
          if (nameParts.length > 0 && nameParts[0] !== 'Default') {
            productCategoryStrings.push(nameParts[0]) // Use first word in name as a category
          }
        }

        // Try looking for properties that might contain category information
        const product = results[originalIndex] as unknown as Record<string, unknown>
        const possibleCategoryFields = ['type', 'group', 'category', 'className']
        for (const field of possibleCategoryFields) {
          const value = product[field]
          if (typeof value === 'string' && value !== 'Default') {
            productCategoryStrings.push(value)
          }
        }

        console.warn(
          `Alternative categories found for product ${results[originalIndex].id}:`,
          productCategoryStrings,
        )
      }

      // Skip category tags for this product if it has no valid categories
      if (productCategoryStrings.length === 0) {
        // Also skip if collection is Default or empty
        if (results[originalIndex].collection === 'Default' || !results[originalIndex].collection) {
          console.warn(
            `Skipping category tag for product ${results[originalIndex].id} - only has Default category`,
          )
          return false
        }
        // If collection is not Default, we'll use it below
      }

      if (productCategoryStrings.length > 0) {
        // Pick a random category from this product's categories
        const productCategory =
          productCategoryStrings[Math.floor(Math.random() * productCategoryStrings.length)]
        results[originalIndex].buzzFactorTag = `${group.tag} "${productCategory}"`
        console.warn(
          `Assigned tag for product ${results[originalIndex].id}: ${results[originalIndex].buzzFactorTag} (${sectionName})`,
        )
      } else if (
        results[originalIndex].collection &&
        results[originalIndex].collection !== 'Default'
      ) {
        // Fall back to collection if no categories and collection is not Default
        results[originalIndex].buzzFactorTag = `${group.tag} "${results[originalIndex].collection}"`
        console.warn(
          `Used collection for product ${results[originalIndex].id}: ${results[originalIndex].buzzFactorTag} (${sectionName})`,
        )
      } else {
        // Pick a random category from the pool if the product has no valid categories
        const randomCategory = categories[Math.floor(Math.random() * categories.length)]
        if (randomCategory && randomCategory !== 'Default') {
          results[originalIndex].buzzFactorTag = `${group.tag} "${randomCategory}"`
          console.warn(
            `Used random category for product ${results[originalIndex].id}: ${results[originalIndex].buzzFactorTag} (${sectionName})`,
          )
        } else {
          // Skip category tag for this product if no valid category is found
          console.warn(
            `No valid category found for product ${results[originalIndex].id}, skipping tag`,
          )
          return false
        }
      }
    } else {
      // For non-category tags
      results[originalIndex].buzzFactorTag = group.tag
      console.warn(
        `Assigned non-category tag for product ${results[originalIndex].id}: ${group.tag} (${sectionName})`,
      )
    }

    // Mark as tagged
    taggedResults.add(String(result.id))
    return true
  }

  // Process each tag group
  for (let groupIndex = 0; groupIndex < tagGroups.length; groupIndex++) {
    const group = tagGroups[groupIndex]
    console.warn(`Processing group: ${group.tag}`)

    let groupTagged = 0
    const targetCount = Math.min(group.count, maxTaggedProducts - totalTagged)

    if (targetCount <= 0) {
      console.warn(`Skipping group ${group.tag} - reached max tags`)
      continue
    }

    // Calculate tag distribution for this group
    const groupFirstSectionTags = Math.floor(targetCount * 0.3) // 30% at beginning
    const groupMiddleSectionTags = Math.floor(targetCount * 0.5) // 50% in middle

    // First section - beginning of results
    for (
      let i = 0;
      i < firstSection.length &&
      firstSectionTagged < firstSectionTags &&
      groupTagged < groupFirstSectionTags;
      i++
    ) {
      if (processResult(firstSection[i], groupIndex, 'beginning')) {
        groupTagged++
        firstSectionTagged++
        totalTagged++
      }
    }

    // Middle section - middle of results
    for (
      let i = 0;
      i < middleSection.length &&
      middleSectionTagged < middleSectionTags &&
      groupTagged < groupFirstSectionTags + groupMiddleSectionTags;
      i++
    ) {
      if (processResult(middleSection[i], groupIndex, 'middle')) {
        groupTagged++
        middleSectionTagged++
        totalTagged++
      }
    }

    // Last section - end of results
    for (
      let i = 0;
      i < lastSection.length && lastSectionTagged < lastSectionTags && groupTagged < targetCount;
      i++
    ) {
      if (processResult(lastSection[i], groupIndex, 'end')) {
        groupTagged++
        lastSectionTagged++
        totalTagged++
      }
    }

    console.warn(
      `Added ${groupTagged} tags for group "${group.tag}" (Distribution: ${firstSectionTagged}/${middleSectionTagged}/${lastSectionTagged})`,
    )

    // If we've reached the maximum total tags, break
    if (totalTagged >= maxTaggedProducts) {
      console.warn(`Reached maximum tagged products (${maxTaggedProducts}), breaking`)
      break
    }
  }

  console.warn(
    `Total tagged products: ${totalTagged} out of ${results.length} (${((totalTagged / results.length) * 100).toFixed(1)}%)`,
  )
  console.warn(
    `Tag distribution: Beginning: ${firstSectionTagged}/${firstSectionTags}, Middle: ${middleSectionTagged}/${middleSectionTags}, End: ${lastSectionTagged}/${lastSectionTags}`,
  )

  return results
}
