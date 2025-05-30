import type {
  PlatformRecommendationsRequest,
  PlatformResult,
  PlatformSemanticQueriesRequest,
} from '@empathyco/x-adapter-platform'
import type {
  ExperienceControlsResponse,
  RecommendationsRequest,
  Result,
  ResultRating,
  SemanticQueriesRequest,
} from '@empathyco/x-types'

import {
  experienceControlsResponseSchema,
  nextQueriesEndpointAdapter,
  platformAdapter,
  popularSearchesEndpointAdapter,
  recommendationsEndpointAdapter,
  recommendationsRequestSchema,
  relatedPromptsEndpointAdapter,
  resultSchema,
  semanticQueriesRequestSchema,
} from '@empathyco/x-adapter-platform'

export const adapter = platformAdapter

/* Code sample about how to extend the result mapper with more fields. */

interface EmpathyDemoPlatformResult extends PlatformResult {
  description: string
  collection: string
  brand: string
  rating?: number
  categories: string[]
}

declare module '@empathyco/x-types' {
  export interface Result {
    collection: string
    description: string
    brand: string
    rating?: ResultRating
    categories?: string[]
  }
}

const isValidRating = (rating: number): boolean => {
  return rating >= 0 && rating <= 5
}

resultSchema.$override<EmpathyDemoPlatformResult, Partial<Result>>({
  description: 'description',
  collection: 'collection',
  brand: 'brand',
  images: ({ __images }) => (Array.isArray(__images) ? __images.reverse() : [__images]),
  rating: ({ rating }) => {
    if (rating !== undefined && isValidRating(rating)) {
      // Round to nearest integer and clamp between 0 and 5
      const roundedRating = Math.round(rating)
      return { value: Math.min(5, Math.max(0, roundedRating)) }
    }
    return undefined
  },
  categories: 'categories',
})

// Disable features by creating empty endpoint adapters
adapter.recommendations = recommendationsEndpointAdapter.extends({
  endpoint: () => '',
  requestMapper: () => ({}),
  responseMapper: () => ({ results: [] }),
})

adapter.relatedPrompts = relatedPromptsEndpointAdapter.extends({
  endpoint: () => '',
  requestMapper: () => ({}),
  responseMapper: () => ({ relatedPrompts: [] }),
})

adapter.nextQueries = nextQueriesEndpointAdapter.extends({
  endpoint: () => '',
  requestMapper: () => ({}),
  responseMapper: () => ({ nextQueries: [] }),
})

adapter.popularSearches = popularSearchesEndpointAdapter.extends({
  endpoint: () => '',
  requestMapper: () => ({}),
  responseMapper: () => ({ suggestions: [] }),
})

recommendationsRequestSchema.$override<
  RecommendationsRequest,
  Partial<PlatformRecommendationsRequest>
>({
  // TODO Top clicked demo endpoint breaks if it receives the scope parameter
  extraParams: ({ extraParams: { scope, ...extraParams } = {} }) => extraParams,
})

semanticQueriesRequestSchema.$override<
  SemanticQueriesRequest,
  Partial<PlatformSemanticQueriesRequest>
>({
  extraParams: ({ extraParams }) => {
    return {
      extraParams,
      filter_ids: 'NOT_ALL_WORDS,NOT_PARTIAL',
    }
  },
})

experienceControlsResponseSchema.$override<
  Partial<ExperienceControlsResponse>,
  Partial<ExperienceControlsResponse>
>({
  controls: ({ controls }) => controls,
  events: {
    SemanticQueriesConfigProvided: {
      maxItemsToRequest: 'controls.semanticQueries.numberOfCarousels',
      resultsPerCarousel: 'controls.semanticQueries.resultsPerCarousels',
    },
  },
})
