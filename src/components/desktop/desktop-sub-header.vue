<template>
  <CollapseHeightAnimation :is-collapsed="hasScrolledPastThreshold">
    <MaxDesktopWidthItem>
      <DesktopSearchboxAlign>
        <div class="x-layout-item" :class="{ 'x-grid x-grid-cols-6': !isFullPredictive }">
          <LocationProvider location="predictive_layer">
            <RelatedTags v-if="x.relatedTags.length > 0" class="x-pb-24" />
          </LocationProvider>
        </div>
      </DesktopSearchboxAlign>

      <div v-if="hasSearched">
        <DesktopToolbar />
      </div>
      <div v-if="x.totalResults > 0 && hasSearched && x.selectedFilters.length">
        <SelectedFilters class="x-py-16" />
      </div>
    </MaxDesktopWidthItem>
  </CollapseHeightAnimation>
</template>

<script lang="ts">
import { LocationProvider, use$x } from '@empathyco/x-components'
import { defineAsyncComponent, defineComponent } from 'vue'
import { useHasScrollPastThreshold } from '../../composables/use-has-scroll-past-threshold.composable'
import CollapseHeightAnimation from '../collapse-height-animation.vue'
import MaxDesktopWidthItem from '../max-desktop-width-item.vue'

import RelatedTags from '../search/related-tags.vue'
import DesktopSearchboxAlign from './desktop-searchbox-align.vue'
import DesktopToolbar from './desktop-toolbar.vue'

export default defineComponent({
  components: {
    MaxDesktopWidthItem,
    LocationProvider,
    RelatedTags,
    CollapseHeightAnimation,
    DesktopToolbar,
    DesktopSearchboxAlign,
    SelectedFilters: defineAsyncComponent(() => import('../search').then(m => m.SelectedFilters)),
  },
  props: {
    hasSearched: {
      type: Boolean,
    },
    isFullPredictive: {
      type: Boolean,
    },
  },
  setup() {
    const { hasScrolledPastThreshold } = useHasScrollPastThreshold()
    return { hasScrolledPastThreshold, x: use$x() }
  },
})
</script>
