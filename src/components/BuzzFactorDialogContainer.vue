<template>
  <div v-show="isOpen" class="buzz-factor-dialog-container">
    <div class="dialog-overlay" @click="closeDialog"></div>
    <div class="dialog-content">
      <button class="close-button" @click="closeDialog">
        <span class="material-icons">close</span>
      </button>
      <BuzzFactorDialog />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import BuzzFactorDialog from './BuzzFactorDialog.vue'

export default defineComponent({
  name: 'BuzzFactorDialogContainer',
  components: {
    BuzzFactorDialog,
  },
  // Explicitly expose methods for parent components
  expose: ['openDialog', 'closeDialog'],
  setup() {
    const isOpen = ref(false)

    const openDialog = () => {
      isOpen.value = true
    }

    const closeDialog = () => {
      isOpen.value = false
    }

    // Expose methods to parent components
    return {
      isOpen,
      openDialog,
      closeDialog,
    }
  },
})
</script>

<style scoped>
.buzz-factor-dialog-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

.dialog-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  width: 500px;
  z-index: 1;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: #f0f0f0;
}

.close-button .material-icons {
  font-size: 24px;
}
</style>
