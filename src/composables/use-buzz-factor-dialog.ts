import { ref } from 'vue'

// Shared state
const isOpen = ref(false)

export const useBuzzFactorDialog = () => {
  const openDialog = () => {
    console.warn('Opening dialog, current state:', isOpen.value)
    isOpen.value = true
    console.warn('Dialog state after opening:', isOpen.value)
  }

  const closeDialog = () => {
    console.warn('Closing dialog, current state:', isOpen.value)
    isOpen.value = false
    console.warn('Dialog state after closing:', isOpen.value)
  }

  return {
    isOpen,
    openDialog,
    closeDialog,
  }
}
