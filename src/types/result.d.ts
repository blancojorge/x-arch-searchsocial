import type { ResultRating, Result as XResult } from '@empathyco/x-types'
import '@empathyco/x-types'

declare module '@empathyco/x-types' {
  export interface Result {
    buzzFactorTag?: string
    pcrTag?: string
    categories?: Array<string | string[]>
    rating?: ResultRating
  }
}

export interface Result extends XResult {
  buzzFactorTag?: string
  pcrTag?: string
  categories?: string[]
  rating?: ResultRating
}
