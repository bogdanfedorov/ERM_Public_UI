import { createApp } from 'vue'
import { QueryCache, QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { createI18n } from 'vue-i18n'
import { ApiError } from '../api/client'
import '../ui/tokens.css'
import App from './App.vue'
import { messages, pluralRules } from './messages'
import { applyPreferences } from './preferences'
import { router } from './router'

applyPreferences()

const toLogin = (error: unknown) => {
  const current = router.currentRoute.value
  if (!(error instanceof ApiError) || error.status !== 401 || current.name === 'login') return
  router.replace({ name: 'login', query: { redirect: current.fullPath } })
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: toLogin }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failures, error) => !(error instanceof ApiError && error.status < 500) && failures < 2,
      refetchOnWindowFocus: true,
    },
  },
})

createApp(App)
  .use(router)
  .use(VueQueryPlugin, { queryClient })
  .use(createI18n({ legacy: false, locale: 'uk', fallbackLocale: 'uk', messages, pluralRules }))
  .mount('#app')
