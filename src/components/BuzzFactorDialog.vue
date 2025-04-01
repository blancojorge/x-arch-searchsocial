<template>
  <teleport to="body">
    <div v-show="isOpen" class="dialog-overlay" @click="closeDialog">
      <div class="dialog-content" @click.stop>
        <button class="close-button" @click="closeDialog">&times;</button>

        <div class="dialog-header">
          <h2>{{ title }}</h2>
        </div>

        <div class="dialog-body">
          <div class="info-section">
            <div class="icon-section">
              <div class="pulse-icon">
                <span class="material-icons">trending_up</span>
              </div>
            </div>
            <h3>What is Buzz Factor?</h3>
            <p>
              Buzz Factor is our smart way of highlighting products that are creating excitement in
              our community. It shows you what's trending, popular, or generating buzz in different
              categories.
            </p>
          </div>

          <div class="tag-types">
            <div class="tag-type">
              <div class="tag bestseller">Hype in "Category"</div>
              <p>Products that are currently trending in specific categories</p>
            </div>
            <div class="tag-type">
              <div class="tag bestseller">Trending now</div>
              <p>Products that are gaining popularity across all categories</p>
            </div>
            <div class="tag-type">
              <div class="tag bestseller">Popular in "Category"</div>
              <p>Most sought-after items in their categories</p>
            </div>
          </div>

          <div class="info-footer">
            <p>
              These tags are updated in real-time based on customer interaction and shopping trends.
            </p>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BuzzFactorDialog',
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: 'Understanding Buzz Factor Tags',
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const closeDialog = () => {
      emit('close')
    }

    return {
      closeDialog,
    }
  },
})
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999;
  backdrop-filter: blur(4px);
}

.dialog-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  z-index: 1000000;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: #f5f5f5;
}

.dialog-header {
  margin-bottom: 2rem;
  text-align: center;
}

.dialog-header h2 {
  font-size: 1.75rem;
  color: #333;
  margin: 0;
}

.info-section {
  text-align: center;
  margin-bottom: 2rem;
}

.icon-section {
  margin-bottom: 1.5rem;
}

.pulse-icon {
  width: 64px;
  height: 64px;
  background: #e63946;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(230, 57, 70, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(230, 57, 70, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(230, 57, 70, 0);
  }
}

.info-section h3 {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 1rem;
}

.info-section p {
  color: #666;
  line-height: 1.6;
}

.tag-types {
  display: grid;
  gap: 1.5rem;
  margin: 2rem 0;
}

.tag-type {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tag {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: bold;
  color: white;
  width: fit-content;
}

.bestseller {
  background-color: #e63946;
}

.tag-type p {
  color: #666;
  font-size: 0.875rem;
  margin: 0;
}

.info-footer {
  text-align: center;
  color: #666;
  font-size: 0.875rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

@media (max-width: 640px) {
  .dialog-content {
    padding: 1.5rem;
  }

  .dialog-header h2 {
    font-size: 1.5rem;
  }
}
</style>
