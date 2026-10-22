const cookie = 'erm_dev_account'
const recentKey = 'erm.devAccounts'
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const isAccountId = (value: string) => uuid.test(value.trim())

export const signIn = (accountId: string) => {
  document.cookie = `${cookie}=${accountId.trim().toLowerCase()}; path=/; SameSite=Strict`
}

export const signOut = () => {
  document.cookie = `${cookie}=; path=/; SameSite=Strict; Max-Age=0`
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
