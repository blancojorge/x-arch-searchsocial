import type {
  PlatformRecommendationsRequest,
  PlatformResult,
  PlatformSemanticQueriesRequest,
} from '@empathyco/x-adapter-platform'
import type {
  ExperienceControlsResponse,
  RecommendationsRequest,
  Result,
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
}

declare module '@empathyco/x-types' {
  export interface Result {
    collection: string
    description: string
    brand: string
  }
}

resultSchema.$override<EmpathyDemoPlatformResult, Partial<Result>>({
  description: 'description',
  collection: 'collection',
  brand: 'brand',
  images: ({ __images }) => (Array.isArray(__images) ? __images.reverse() : [__images]),
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
