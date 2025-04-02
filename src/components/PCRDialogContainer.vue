<template>
  <div v-show="isOpen" class="pcr-dialog-container">
    <button
      class="close-button"
      @click.stop.prevent="handleClose"
      @mousedown.stop.prevent
      @touchstart.stop.prevent
    >
      <span class="material-icons">close</span>
    </button>
    <div class="dialog-content">
      <PCRDialog />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import PCRDialog from './PCRDialog.vue'

export default defineComponent({
  name: 'PCRDialogContainer',
  components: {
    PCRDialog,
  },
  props: {
    close: {
      type: Function,
      required: true,
    },
  },
  // Explicitly expose methods for parent components
  expose: ['openDialog', 'closeDialog'],
  setup(props) {
    const isOpen = ref(false)

    const openDialog = () => {
      isOpen.value = true
    }

    const closeDialog = () => {
      isOpen.value = false
    }

    const handleClose = () => {
      closeDialog()
      props.close()
    }

    // Expose methods to parent components
    return {
      isOpen,
      openDialog,
      closeDialog,
      handleClose,
    }
  },
})
</script>

<style scoped>
.pcr-dialog-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1002;
}

.dialog-content {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1002;
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
  z-index: 1003;
}

.close-button:hover {
  background-color: #f0f0f0;
}

.close-button .material-icons {
  font-size: 24px;
}
</style>
