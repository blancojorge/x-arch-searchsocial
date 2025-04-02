<template>
  <div class="pcr-dialog">
    <div class="dialog-header">
      <h2>What is<br />Purchase Confidence Rating?</h2>
    </div>
    <div class="dialog-body">
      <div class="info-section">
        <div class="icon-section">
          <div class="pulse-icon">
            <span class="material-symbols-outlined">diamond</span>
          </div>
        </div>
        <p>
          These are our most consistently satisfying products across the entire store. The ones our
          community buys the most.
        </p>
      </div>

      <div class="tag-types">
        <div class="tag-type">
          <div class="tag hype">Bestseller</div>
          <p>Our most consistently satisfying products across the entire store</p>
        </div>
        <div class="tag-type">
          <div class="tag hype">Sales hit</div>
          <p>Top performer specifically for what you're searching for</p>
        </div>
        <div class="tag-type">
          <div class="tag hype">Trusted Pick</div>
          <p>Proven reliability champion in this product category</p>
        </div>
      </div>

      <div class="info-footer">
        <p>
          These rates are updated in a daily basis based on customer shopping trends.
          <br />
          <a
            class="info-footer-link underline"
            href="https://empathy.co/blog/buzz-factor"
            target="_blank"
            >Learn more about Purchase Confidence Rating</a
          >
        </p>
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
  width: 100%;
}

.dialog-header {
  margin-top: 2rem;
  margin-bottom: 1rem;
  text-align: center;
}

.dialog-header h2 {
  font-size: 1.75rem;
  color: #333;
  margin: 0;
}

.dialog-body {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-section {
  text-align: center;
  margin-bottom: 0.3rem;
}

.icon-section {
  margin-bottom: 1.5rem;
}

.pulse-icon {
  width: 64px;
  height: 64px;
  background: #f9c424;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(250, 193, 21, 0.672);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 238, 161, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(230, 57, 70, 0);
  }
}

.pulse-icon .material-icons {
  font-size: 32px;
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
  margin: 0.5rem auto;
  text-align: center;
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
  margin: 0 auto;
}

.trending {
  background-color: #e63946;
}

.tag-type p {
  color: #666;
  font-size: 0.875rem;
  margin: 0;
}

.hype {
  background-color: #ffffff;
  color: #000000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  max-width: calc(100% - 20px);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
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
  .dialog-header h2 {
    font-size: 1.5rem;
  }
}
.material-symbols-outlined {
  font-size: 2rem;
}
</style>
