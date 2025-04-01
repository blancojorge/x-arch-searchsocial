<template>
  <div v-if="tag" class="buzz-factor-tag" :class="tagClass">
    {{ tag }}
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watch } from 'vue'

export default defineComponent({
  name: 'BuzzFactor',
  props: {
    tag: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const tagClass = computed(() => {
      if (!props.tag) return ''
      if (props.tag.includes('Hype')) return 'bestseller'
      if (props.tag.includes('Trending now')) return 'bestseller'
      if (props.tag.includes('Popular')) return 'bestseller'
      return ''
    })

    onMounted(() => {
      if (props.tag) {
        console.warn('BuzzFactor mounted with tag:', props.tag)
      }
    })

    // Watch for changes in the tag prop
    watch(
      () => props.tag,
      (newTag, oldTag) => {
        console.warn(`BuzzFactor tag changed from "${oldTag}" to "${newTag}"`)
      },
    )

    return {
      tagClass,
    }
  },
})
</script>

<style scoped>
.buzz-factor-tag {
  position: absolute;
  bottom: 10px;
  left: 10px;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  z-index: 20;
  pointer-events: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  max-width: calc(100% - 20px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bestseller {
  background-color: #e63946;
}

.rising-star {
  background-color: #4361ee;
}
</style>
