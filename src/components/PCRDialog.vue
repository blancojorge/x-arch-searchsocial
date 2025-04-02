<template>
  <div class="pcr-dialog">
    <h2>Purchase Confidence Rating</h2>
    <div class="pcr-content">
      <div class="pcr-description">
        <p>
          The Purchase Confidence Rating (PCR) is a measure of how likely a product is to be
          purchased based on various factors including:
        </p>
        <ul>
          <li>Product rating</li>
          <li>Price competitiveness</li>
          <li>Brand reputation</li>
          <li>Customer reviews</li>
        </ul>
      </div>
      <div class="pcr-tags">
        <div class="tag high">
          <span class="material-icons">trending_up</span>
          <span class="tag-text">High Confidence</span>
        </div>
        <div class="tag medium">
          <span class="material-icons">trending_flat</span>
          <span class="tag-text">Medium Confidence</span>
        </div>
        <div class="tag low">
          <span class="material-icons">trending_down</span>
          <span class="tag-text">Low Confidence</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PCRDialog',
})
</script>

<style scoped>
.pcr-dialog {
  padding: 20px;
}

h2 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 24px;
}

.pcr-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pcr-description {
  color: #666;
  line-height: 1.5;
}

.pcr-description ul {
  margin: 10px 0;
  padding-left: 20px;
}

.pcr-description li {
  margin: 5px 0;
}

.pcr-tags {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.tag {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.tag .material-icons {
  font-size: 24px;
}

.tag-text {
  font-weight: 500;
}

.tag.high {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.tag.medium {
  background-color: #fff3e0;
  color: #ef6c00;
}

.tag.low {
  background-color: #ffebee;
  color: #c62828;
}
</style>
