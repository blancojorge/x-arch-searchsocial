<template>
  <div class="buzz-factor-wrapper">
    <button class="buzz-factor-tag" :class="tagClass" @click.stop.prevent="handleClick">
      <div class="pulse-icon">
        <span class="material-icons">trending_up</span>
      </div>
      <span class="buzz-factor-tag-text">{{ tag }}</span>
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
  name: 'BuzzFactor',
  props: {
    tag: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const dialogContainer = inject<DialogContainer>('buzzFactorDialogContainer')

    const tagClass = computed(() => {
      const tag = props.tag.toLowerCase()
      if (tag.includes('hype')) return 'buzz-factor-tag--high'
      if (tag.includes('trending')) return 'buzz-factor-tag--medium'
      if (tag.includes('popular')) return 'buzz-factor-tag--low'
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
.buzz-factor-wrapper {
  background-color: rebeccapurple;
}

.buzz-factor-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  min-height: 25px;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 0.7em;
  font-weight: bold;
  color: white;
  z-index: 0;
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
  text-decoration: none;
  border: none;
  background: none;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}

.buzz-factor-tag .buzz-factor-tag-text {
  margin-left: 0.4rem;
}

.buzz-factor-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.buzz-factor-tag--high {
  background-color: #edbf3b;
}

.buzz-factor-tag--medium {
  background-color: #e63946;
}

.buzz-factor-tag--low {
  background-color: #53b9c9;
}

.pulse-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(243, 241, 241, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(230, 57, 70, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(230, 57, 70, 0);
  }
}
</style>
