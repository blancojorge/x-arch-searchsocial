import type { XPlugin } from '@empathyco/x-components'
import CustomResults from '../components/custom-results.vue'

export const customResultsPlugin = {
  install(app) {
    app.component('XResults', CustomResults)
  },
} as XPlugin
