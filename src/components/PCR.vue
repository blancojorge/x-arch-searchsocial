<template>
  <div class="pcr-wrapper">
    <button class="pcr-tag" :class="tagClass" @click.stop.prevent="handleClick">
      <span class="pcr-tag-text">{{ tag }}</span>
      <div v-if="tag.toLowerCase().includes('bestseller')" class="pulse-icon">
        <span class="material-symbols-outlined">diamond</span>
      </div>
    </button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue'

interface DialogContainer {
  openDialog: () => void
  closeDialog: () => void
}

export default defineComponent({
  name: 'PCR',
  props: {
    tag: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const dialogContainer = inject<DialogContainer>('pcrDialogContainer')

    const tagClass = computed(() => {
      const tag = props.tag.toLowerCase()
      if (tag.includes('sales hit')) return 'pcr-tag--high'
      if (tag.includes('bestseller')) return 'pcr-tag--medium'
      if (tag.includes('trusted pick')) return 'pcr-tag--low'
      return ''
    })

    const handleClick = () => {
      if (dialogContainer?.openDialog) {
        dialogContainer.openDialog()
      }
    }

    return {
      tagClass,
      handleClick,
    }
  },
})
</script>

<style scoped>
.pcr-wrapper {
  background-color: rebeccapurple;
}

.pcr-tag {
  position: absolute;
  bottom: 15px;
  right: 5px;
  min-height: 25px;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 0.7em;
  font-weight: bold;
  color: rgb(0, 0, 0);
  z-index: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  max-width: calc(100% - 20px);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  user-select: none;
  text-decoration: none;
  border: none;
  background: none;
  font-family: inherit;
  align-items: center;
  justify-content: center;
  display: flex;
}

.pcr-tag-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pcr-tag .pcr-tag-text {
  overflow: hidden;
  white-space: nowrap;
  display: block;
  text-overflow: ellipsis;
  cursor: pointer;
}

.pcr-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.pcr-tag--high {
  background-color: #ffffff;
}

.pcr-tag--medium {
  background-color: #ffffff;
}

.pcr-tag--low {
  background-color: #53b9c9;
}

.pulse-icon {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgb(0, 0, 0);
  animation: pulse 2s infinite;
  margin-left: 0.5 rem;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(87, 75, 76, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(230, 57, 70, 0);
  }
}
.material-symbols-outlined {
  font-size: 20px;
}
</style>
