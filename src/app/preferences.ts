import { ref, watch } from 'vue'

export type Theme = 'system' | 'light' | 'dark'
export type Density = 'regular' | 'compact'

const read = <T extends string>(key: string, allowed: readonly T[], fallback: T): T => {
  try {
    const value = localStorage.getItem(key)
    return allowed.includes(value as T) ? (value as T) : fallback
  } catch {
    return fallback
  }
}

const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    return
  }
}

export const theme = ref<Theme>(read('erm.theme', ['system', 'light', 'dark'], 'system'))
export const density = ref<Density>(
  read(
    'erm.density',
    ['regular', 'compact'],
    matchMedia('(min-width: 1024px)').matches ? 'compact' : 'regular',
  ),
)

const dark = matchMedia('(prefers-color-scheme: dark)')

const render = () => {
  const root = document.documentElement
  const effective = theme.value === 'system' ? (dark.matches ? 'dark' : 'light') : theme.value
  root.dataset.theme = effective
  root.dataset.density = density.value
}

export const applyPreferences = () => {
  render()
  dark.addEventListener('change', render)
  watch(theme, (value) => {
    write('erm.theme', value)
    render()
  })
  watch(density, (value) => {
    write('erm.density', value)
    render()
  })
}
