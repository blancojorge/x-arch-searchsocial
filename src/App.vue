<template>
  <div class="x" data-test="x" :dir="documentDirection">
    <SnippetConfigExtraParams />
    <SnippetCallbacks />
    <Tagging />
    <UrlHandler />
    <ExperienceControls />
    <MainModal v-if="isOpen" data-wysiwyg="layer">
      <BuzzFactorDialogContainer ref="buzzFactorDialog" />
    </MainModal>
    <PCRModal v-model="isPCROpen">
      <template #default="{ close }">
        <PCRDialogContainer ref="pcrDialog" :close="close" />
      </template>
    </PCRModal>
  </div>
</template>

<script lang="ts">
import type { SnippetConfig, UrlParams, XEvent } from '@empathyco/x-components'
import type { QueryPreviewInfo } from '@empathyco/x-components/queries-preview'
import type { InternalSearchRequest, InternalSearchResponse } from '@empathyco/x-components/search'
import type { ComputedRef } from 'vue'
import { SnippetCallbacks, useXBus } from '@empathyco/x-components'
import { ExperienceControls } from '@empathyco/x-components/experience-controls'
import { SnippetConfigExtraParams } from '@empathyco/x-components/extra-params'
import { Tagging } from '@empathyco/x-components/tagging'
import { UrlHandler } from '@empathyco/x-components/url'
import {
  computed,
  defineAsyncComponent,
  defineComponent,
  getCurrentInstance,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  watch,
} from 'vue'
import BuzzFactorDialogContainer from './components/BuzzFactorDialogContainer.vue'
import PCRDialogContainer from './components/PCRDialogContainer.vue'
import PCRModal from './components/PCRModal.vue'
import { useDevice } from './composables/use-device.composable'
import { isIOS, removeSearchInputFocus } from './composables/use-ios-utils-composable'
import currencies from './i18n/currencies'
import { assignBuzzFactorTags } from './utils/buzz-factor'
import { assignPCRTags } from './utils/purchase-confidence'
import './tailwind/index.css'

// Add Material Icons font
const materialIconsLink = document.createElement('link')
materialIconsLink.rel = 'stylesheet'
materialIconsLink.href = 'https://fonts.googleapis.com/icon?family=Material+Icons'
document.head.appendChild(materialIconsLink)

// Add Material Symbols Outlined font
const materialSymbolsLink = document.createElement('link')
materialSymbolsLink.rel = 'stylesheet'
materialSymbolsLink.href =
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'
document.head.appendChild(materialSymbolsLink)

export default defineComponent({
  name: 'App',
  components: {
    SnippetCallbacks,
    SnippetConfigExtraParams,
    Tagging,
    UrlHandler,
    ExperienceControls,
    BuzzFactorDialogContainer,
    PCRDialogContainer,
    PCRModal,
    MainModal: defineAsyncComponent(() =>
      import('./components/custom-main-modal.vue').then(m => m.default),
    ),
  },
  setup() {
    const xBus = useXBus()
    const appInstance = getCurrentInstance()
    const { deviceName } = useDevice()
    const snippetConfig = inject<SnippetConfig>('snippetConfig')
    if (!snippetConfig) {
      throw new Error('snippetConfig is required')
    }
    const isOpen = ref(false)
    const buzzFactorDialog = ref()
    const pcrDialog = ref()
    const isPCROpen = ref(false)

    // Provide the dialog container methods to child components
    provide('buzzFactorDialogContainer', {
      openDialog: () => {
        isOpen.value = true
        buzzFactorDialog.value?.openDialog()
      },
      closeDialog: () => {
        isOpen.value = false
        buzzFactorDialog.value?.closeDialog()
      },
    })

    // Provide the PCR dialog container methods to child components
    provide('pcrDialogContainer', {
      openDialog: () => {
        isPCROpen.value = true
        nextTick(() => {
          pcrDialog.value?.openDialog()
        })
      },
      closeDialog: () => {
        isPCROpen.value = false
        pcrDialog.value?.closeDialog()
      },
    })

    const openXEvents = ['UserOpenXProgrammatically', 'UserClickedOpenX']

    const open = (): void => {
      isOpen.value = true
      if (window.wysiwyg) {
        window.wysiwyg.open()
      }
    }

    openXEvents.forEach(event => xBus.on(event as XEvent, false).subscribe(open))

    const close = (): void => {
      if (window.wysiwyg) {
        window.wysiwyg.close()
      }
    }

    xBus.on('UserClickedCloseX', false).subscribe(close)

    xBus.on('UserAcceptedAQuery', false).subscribe(async (query): Promise<void> => {
      if (/^::\s*login/.test(query)) {
        if (window.wysiwyg) {
          await window.wysiwyg.goToLogin()
        }
      }
    })

    xBus
      .on('SearchRequestChanged', false)
      .subscribe((payload: InternalSearchRequest | null): void => {
        if (window.wysiwyg) {
          window.wysiwyg.setContext({ query: payload?.query, spellcheckedQuery: undefined })
        }
      })

    xBus.on('SearchResponseChanged', false).subscribe((payload: InternalSearchResponse): void => {
      if (payload.spellcheck && window.wysiwyg) {
        window.wysiwyg.setContext({ spellcheckedQuery: payload.spellcheck })
      }

      // Add buzz factor tags to results
      if (payload.results && payload.results.length > 0) {
        // Get the search query from multiple possible sources
        const searchQuery =
          (payload as InternalSearchResponse & { query?: string }).query ||
          (payload.request as InternalSearchRequest)?.query ||
          (window.initX
            ? typeof window.initX === 'function'
              ? window.initX().query
              : window.initX.query
            : '') ||
          ''

        // Add buzz factor tags to the results
        const resultsWithBuzzFactor = assignBuzzFactorTags(payload.results, String(searchQuery))
        const resultsWithPCR = assignPCRTags(resultsWithBuzzFactor, String(searchQuery))

        payload.results = resultsWithPCR
      }
    })

    xBus.on('ParamsLoadedFromUrl', false).subscribe(async (payload: UrlParams): Promise<void> => {
      try {
        if (window.wysiwyg) {
          await window.wysiwyg.requestAuth()
          if (window.InterfaceX && typeof window.InterfaceX.search === 'function') {
            window.InterfaceX.search()
          } else {
            const checkInterfaceX = setInterval(() => {
              if (window.InterfaceX && typeof window.InterfaceX.search === 'function') {
                window.InterfaceX.search()
                clearInterval(checkInterfaceX)
              }
            }, 100)
          }
          window.wysiwyg.setContext({ query: payload.query })
        }
      } catch {
        // No error handling
      }
    })

    const documentDirection = computed(() => {
      return (
        document.documentElement.dir ||
        document.body.dir ||
        (snippetConfig.documentDirection ?? 'ltr')
      )
    })

    const currencyFormat = computed(() => {
      const currency = snippetConfig.currency
      return currency ? currencies[currency] : currencies.EUR // Fallback to EUR if currency is not set
    })
    provide<string>('currencyFormat', currencyFormat.value)

    const queriesPreviewInfo = computed(() => snippetConfig.queriesPreview ?? [])
    provide<ComputedRef<QueryPreviewInfo[]> | undefined>('queriesPreviewInfo', queriesPreviewInfo)

    watch(
      () => snippetConfig.uiLang,
      uiLang => appInstance?.appContext.config.globalProperties.$setLocale(uiLang ?? 'en'),
    )

    watch(deviceName, device =>
      appInstance?.appContext.config.globalProperties.$setLocaleDevice(device),
    )

    const reloadSearch = (): void => {
      xBus.emit('ReloadSearchRequested')
    }

    onMounted(() => {
      document.addEventListener('wysiwyg:reloadSearch', () => reloadSearch())
    })

    onBeforeUnmount(() => {
      document.removeEventListener('wysiwyg:reloadSearch', () => reloadSearch())
    })

    //fix keyboard issue on iOS
    if (isIOS()) {
      document.addEventListener('touchmove', removeSearchInputFocus)
      onBeforeUnmount(() => {
        document.removeEventListener('touchmove', removeSearchInputFocus)
      })
    }

    const openBuzzFactorDialog = () => {
      buzzFactorDialog.value?.openDialog()
    }

    const openPCRDialog = () => {
      pcrDialog.value?.openDialog()
    }

    return {
      isOpen,
      isPCROpen,
      documentDirection,
      buzzFactorDialog,
      pcrDialog,
      openBuzzFactorDialog,
      openPCRDialog,
    }
  },
})
</script>

<style scoped>
.x-modal:deep(.x-modal__content) {
  width: 100%;
  height: 100%;
  background-color: white;
  overflow: auto;
}
</style>

<style lang="scss">
*:not(.x-keyboard-navigation *) {
  outline: none;
}

.x-banner,
.x-promoted {
  &__title {
    display: none;
  }
}

.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: 'liga';
}

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: 'liga';
}
</style>
