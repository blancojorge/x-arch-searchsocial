<template>
  <BaseIdModal modal-id="buzz-factor-dialog" :animation="animation" content-class="x-bg-neutral-0">
    <BuzzFactorDialog title="Understanding Buzz Factor Tags" />
  </BaseIdModal>
</template>

<script lang="ts">
import { animateScale, BaseIdModal } from '@empathyco/x-components'
import { defineComponent } from 'vue'
import BuzzFactorDialog from './BuzzFactorDialog.vue'

export default defineComponent({
  name: 'BuzzFactorDialogContainer',
  components: {
    BuzzFactorDialog,
    BaseIdModal,
  },
  setup() {
    const animation = animateScale()

    return {
      animation,
    }
  },
})
</script>

<style scoped>
.buzz-factor-dialog-container {
  isolation: isolate;
  position: fixed;
  z-index: 999999;
}
</style>
