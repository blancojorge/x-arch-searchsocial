<template>
  <div class="buzz-factor-wrapper">
    <BaseIdModalOpen
      modal-id="buzz-factor-dialog"
      class="buzz-factor-tag"
      :class="tagClass"
      @click.stop.prevent
    >
      {{ tag }}
    </BaseIdModalOpen>
  </div>
</template>

<script lang="ts">
import { BaseIdModalOpen } from '@empathyco/x-components'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'BuzzFactor',
  components: {
    BaseIdModalOpen,
  },
  props: {
    tag: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const tagClass = computed(() => {
      const tag = props.tag.toLowerCase()
      if (tag.includes('hype')) return 'buzz-factor-tag--high'
      if (tag.includes('trending')) return 'buzz-factor-tag--medium'
      if (tag.includes('popular')) return 'buzz-factor-tag--low'
      return ''
    })

    return {
      tagClass,
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
}

.buzz-factor-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.buzz-factor-tag--high {
  background-color: #e63946;
}

.buzz-factor-tag--medium {
  background-color: #f4a261;
}

.buzz-factor-tag--low {
  background-color: #2a9d8f;
}
</style>
