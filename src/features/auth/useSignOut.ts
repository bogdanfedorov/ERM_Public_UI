import { useRouter } from 'vue-router'
import { useQueryClient } from '@tanstack/vue-query'
import { signOut } from './devSession'

export const useSignOut = () => {
  const router = useRouter()
  const client = useQueryClient()
  return async () => {
    signOut()
    client.clear()
    await router.replace({ name: 'login' })
  }
}
