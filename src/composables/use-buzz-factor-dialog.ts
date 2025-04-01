import { ref } from 'vue'

export interface BuzzFactorTag {
  label: string
  type: 'high' | 'medium' | 'low'
}

const isOpen = ref(false)
const currentTag = ref<BuzzFactorTag | null>(null)

export function useBuzzFactorDialog() {
  const openDialog = (tag: BuzzFactorTag) => {
    currentTag.value = tag
    isOpen.value = true
  }

  const closeDialog = () => {
    isOpen.value = false
    currentTag.value = null
  }

  return {
    isOpen,
    currentTag,
    openDialog,
    closeDialog,
  }
}
