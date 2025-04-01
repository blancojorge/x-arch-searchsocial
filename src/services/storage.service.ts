interface ProductTags {
  buzzFactor?: string
  query?: string
}

export class StorageService {
  private static readonly STORAGE_KEY = 'product_tags'

  static saveProductTag(productId: string, tags: ProductTags): void {
    const existingTags = this.getAllProductTags()
    existingTags[productId] = tags
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingTags))
  }

  static getProductTag(productId: string): ProductTags | null {
    const allTags = this.getAllProductTags()
    return allTags[productId] || null
  }

  static getAllProductTags(): Record<string, ProductTags> {
    const storedTags = localStorage.getItem(this.STORAGE_KEY)
    if (!storedTags) return {}
    try {
      const parsedTags = JSON.parse(storedTags) as Record<string, ProductTags>
      return parsedTags
    } catch {
      return {}
    }
  }

  static removeProductTag(productId: string): void {
    const allTags = this.getAllProductTags()
    delete allTags[productId]
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allTags))
  }

  static clearAllTags(): void {
    localStorage.removeItem(this.STORAGE_KEY)
  }
}
