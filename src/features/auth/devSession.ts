import { ApiError, createApi } from '../../api/client'

const recentKey = 'erm.devAccounts'
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const isAccountId = (value: string) => uuid.test(value.trim())

// See docs/architecture/12-isolation-limits-lifecycle.md#session
export const signIn = async (accountId: string) => {
  const { response } = await createApi().POST('/dev/session', {
    body: { account_id: accountId.trim().toLowerCase() },
  })
  if (!response.ok) throw new ApiError(response.status, response.statusText)
}

export const signOut = async () => {
  await createApi().DELETE('/session')
}

export const recentAccounts = (): string[] => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(recentKey) ?? '[]')
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === 'string' && isAccountId(x))
      : []
  } catch {
    return []
  }
}

export const remember = (accountId: string) => {
  const id = accountId.trim().toLowerCase()
  try {
    const next = [id, ...recentAccounts().filter((x) => x !== id)].slice(0, 5)
    localStorage.setItem(recentKey, JSON.stringify(next))
  } catch {
    return
  }
}

export const forget = (accountId: string) => {
  try {
    localStorage.setItem(recentKey, JSON.stringify(recentAccounts().filter((x) => x !== accountId)))
  } catch {
    return
  }
}
