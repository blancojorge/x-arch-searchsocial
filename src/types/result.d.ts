import '@empathyco/x-types'

declare module '@empathyco/x-types' {
  export interface Result {
    buzzFactorTag?: string
    categories?: Array<string | string[]>
    rating?: ResultRating
  }
}
