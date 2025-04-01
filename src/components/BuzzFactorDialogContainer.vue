<template>
  <teleport to="body">
    <BuzzFactorDialog
      :is-open="isOpen"
      title="Understanding Buzz Factor Tags"
      @close="closeDialog"
    />
  </teleport>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import { useBuzzFactorDialog } from '../composables/use-buzz-factor-dialog'
import BuzzFactorDialog from './BuzzFactorDialog.vue'

export default defineComponent({
  name: 'BuzzFactorDialogContainer',
  components: {
    BuzzFactorDialog,
  },
  setup() {
    const { isOpen, closeDialog } = useBuzzFactorDialog()

    watch(isOpen, newValue => {
      console.warn('Dialog container state changed:', newValue)
    })

    return {
      isOpen,
      closeDialog,
    }
  },
})
</script>
