<template>
  <div
    class="x-rounded x-group x-relative x-flex x-items-center x-p-0"
    :style="{ backgroundColor: '#ffffff' }"
  >
    <div class="x-ml-[-5px] x-block x-flex x-flex-shrink-0 x-cursor-pointer x-items-center">
      <!-- Star rating -->
      <div class="x-flex x-items-center">
        <svg
          v-for="i in 5"
          :key="i"
          class="x-h-24 x-w-24 x-transition-colors x-duration-200"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            :fill="i <= filledStars ? '#FFB800' : '#E5E7EB'"
            stroke="none"
          />
        </svg>
      </div>
      <!--<span class="x-flex x-items-center">{{Math.round(rating* 10) / 10}}</span>-->
    </div>
    <div
      v-if="showTooltip"
      class="x-absolute x-bottom-[50%] x-left-1/2 x-mb-2 -x-translate-x-1/2 x-transform x-p-8"
      style="backgroundcolor: #eee"
    >
      <div class="x-font-medium">
        {{ $t('kpi.purchaseConfidence', { rating: Math.round(rating * 10) / 10 }) }}
      </div>
      <div class="x-text-gray-300 x-mt-1 x-text-xs">{{ $t('kpi.purchaseConfidenceTooltip') }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    rating: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const filledStars = computed(() => Math.round(props.rating * 10) / 10)
    const showTooltip = ref(false)
    return { filledStars, showTooltip }
  },
})
</script>
