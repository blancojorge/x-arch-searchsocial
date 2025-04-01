<template>
  <div class="x-results">
    <slot v-for="result in results" :key="result.id" name="result" :result="result">
      <div class="x-results__item">
        <div class="x-results__item-image">
          <img :src="result.image" :alt="result.name" />
        </div>
        <div class="x-results__item-info">
          <div class="x-results__item-info-title">
            <h2>{{ result.name }}</h2>
          </div>
          <div class="x-results__item-info-price">
            <span>{{ result.price.value }}</span>
          </div>
          <div class="x-results__item-info-tags">
            <template v-for="tag in result.tags || []" :key="tag">
              <span class="x-results__item-info-tag" @click="handleTagClick(result.id, tag)">
                {{ tag }}
              </span>
            </template>
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import type { Result, ResultPrice } from '@empathyco/x-types'
import { defineComponent } from 'vue'
import { StorageService } from '../services/storage.service'

interface ResultWithTags extends Result {
  tags?: string[]
  image?: string
  name: string
  price: ResultPrice
  id: string
}

export default defineComponent({
  name: 'CustomResults',
  props: {
    results: {
      type: Array as () => ResultWithTags[],
      required: false,
      default: () => [],
    },
  },
  setup() {
    const handleTagClick = (productId: string | number, tag: string) => {
      const storedTags = StorageService.getProductTag(String(productId)) || {}

      // Determine if it's a buzz factor or query tag
      if (tag.includes('Buzz Factor')) {
        storedTags.buzzFactor = tag
      } else {
        storedTags.query = tag
      }

      StorageService.saveProductTag(String(productId), storedTags)
    }

    return {
      handleTagClick,
    }
  },
})
</script>

<style scoped>
.x-results {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.x-results__item {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.x-results__item-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.x-results__item-info {
  padding: 1rem;
}

.x-results__item-info-title h2 {
  margin: 0;
  font-size: 1rem;
}

.x-results__item-info-price {
  margin-top: 0.5rem;
  font-weight: bold;
}

.x-results__item-info-tags {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.x-results__item-info-tag {
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
}

.x-results__item-info-tag:hover {
  background: #e0e0e0;
}
</style>
