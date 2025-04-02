<template>
  <div v-if="modelValue" class="pcr-modal">
    <div class="pcr-modal__overlay" @click="$emit('update:modelValue', false)"></div>
    <div class="pcr-modal__content">
      <slot :close="close"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PCRModal',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const close = () => {
      emit('update:modelValue', false)
    }
    return { close }
  },
})
</script>

<style scoped>
.pcr-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pcr-modal__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

.pcr-modal__content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  width: 500px;
  z-index: 1001;
}
</style>
