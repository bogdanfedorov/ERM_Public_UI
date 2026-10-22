import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

const devAccountCookie = 'erm_dev_account'
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const accountFrom = (cookie: string | undefined) => {
  const value = cookie
    ?.split(';')
    .map((part) => part.trim().split('='))
    .find(([name]) => name === devAccountCookie)?.[1]
  return value && uuid.test(value) ? value : undefined
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'ERM_')
  const backend = env.ERM_BACKEND_URL ?? 'http://localhost:8080'

  return {
    plugins: [vue(), tailwindcss()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: backend,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              proxyReq.removeHeader('X-Account-ID')
              const account = accountFrom(req.headers.cookie)
              if (account) proxyReq.setHeader('X-Account-ID', account)
            })
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
      include: ['src/**/*.test.ts'],
    },
  }
})
