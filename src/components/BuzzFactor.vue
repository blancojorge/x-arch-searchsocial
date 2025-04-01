<template>
  <div class="buzz-factor-wrapper">
    <div v-if="tag" class="buzz-factor-tag" :class="tagClass" @click.stop.prevent="handleClick">
      {{ tag }}
    </div>
    <BuzzFactorDialog :is-open="isDialogOpen" @close="closeDialog" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import BuzzFactorDialog from './BuzzFactorDialog.vue'

export default defineComponent({
  name: 'BuzzFactor',
  components: {
    BuzzFactorDialog,
  },
  props: {
    tag: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const isDialogOpen = ref(false)
    let parentLink: HTMLAnchorElement | null = null

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
        parentLink = tag.closest('a')
        if (parentLink) {
          // Store the original href
          const originalHref = parentLink.getAttribute('href')
          parentLink.setAttribute('data-original-href', originalHref || '')
          parentLink.removeAttribute('href')
        }
      }

      isDialogOpen.value = true
    }

    const closeDialog = () => {
      // Re-enable the parent link after a small delay
      if (parentLink) {
        setTimeout(() => {
          const originalHref = parentLink?.getAttribute('data-original-href')
          if (originalHref) {
            parentLink?.setAttribute('href', originalHref)
            parentLink?.removeAttribute('data-original-href')
          }
          parentLink = null
        }, 0)
      }

      isDialogOpen.value = false
    }

    return {
      tagClass,
      isDialogOpen,
      handleClick,
      closeDialog,
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
