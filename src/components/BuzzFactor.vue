<template>
  <div class="buzz-factor-wrapper">
    <div v-if="tag" class="buzz-factor-tag" :class="tagClass" @click.stop.prevent="handleClick">
      {{ tag }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useBuzzFactorDialog } from '../composables/use-buzz-factor-dialog'

export default defineComponent({
  name: 'BuzzFactor',
  props: {
    tag: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const { openDialog } = useBuzzFactorDialog()
    const parentLink = ref<HTMLAnchorElement | null>(null)

    const tagClass = computed(() => {
      if (!props.tag) return ''
      if (props.tag.includes('Hype')) return 'bestseller'
      if (props.tag.includes('Trending now')) return 'bestseller'
      if (props.tag.includes('Popular')) return 'bestseller'
      return ''
    })

    const handleClick = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()

      // Find and disable the parent link
      const tag = document.querySelector('.buzz-factor-tag')
      if (tag) {
        parentLink.value = tag.closest('a')
        if (parentLink.value) {
          // Store the original href
          const originalHref = parentLink.value.getAttribute('href')
          parentLink.value.setAttribute('data-original-href', originalHref || '')
          parentLink.value.removeAttribute('href')
        }
      }

      openDialog()
    }

    return {
      tagClass,
      handleClick,
    }
  },
})
</script>

<style scoped>
.buzz-factor-wrapper {
  position: relative;
  z-index: 30;
}

.buzz-factor-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  z-index: 31;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  max-width: calc(100% - 20px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  user-select: none;
}

.buzz-factor-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.bestseller {
  background-color: #e63946;
}

.rising-star {
  background-color: #4361ee;
}
</style>
