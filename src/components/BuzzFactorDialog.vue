<template>
  <div class="buzz-factor-dialog">
    <div class="dialog-header">
      <h2>What is Buzz Factor?</h2>
    </div>
    <div class="dialog-body">
      <div class="info-section">
        <div class="icon-section">
          <div class="pulse-icon">
            <span class="material-icons">trending_up</span>
          </div>
        </div>
        <p>
          Buzz Factor highlights products that are creating excitement in our community. It shows
          you what's trending, popular, or generating buzz in different categories.
        </p>
      </div>

      <div class="tag-types">
        <div class="tag-type">
          <div class="tag hype">Hype in "search term"</div>
          <p>Products that are currently trending in specific search terms</p>
        </div>
        <div class="tag-type">
          <div class="tag trending">Trending now</div>
          <p>The treasures everyone's talking about</p>
        </div>
        <div class="tag-type">
          <div class="tag popular">Popular in "Category"</div>
          <p>Most sought-after items in their categories</p>
        </div>
      </div>

      <div class="info-footer">
        <p>
          These factors are updated in a daily basis based customer interaction and shopping trends.
          <br />
          <a
            class="info-footer-link underline"
            href="https://empathy.co/blog/buzz-factor"
            target="_blank"
            >Learn more about Buzz Factor</a
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BuzzFactorDialog',
})
</script>

<style scoped>
.buzz-factor-dialog {
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
  background: #e63946;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
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

.hype {
  background-color: #53b9c9;
}

.popular {
  background-color: #edbf3b;
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
  .dialog-header h2 {
    font-size: 1.5rem;
  }
}
</style>
