import { ApiError, ActionDenied } from '../../api/client'

export const errorMessage = (error: unknown, t: (key: string) => string) => {
  if (error instanceof ActionDenied) return t('error.denied')
  if (error instanceof ApiError) {
    if (error.status === 401) return t('error.unauthorized')
    if (error.status === 403) return t('error.forbidden')
    if (error.status === 404) return t('error.notFound')
    if (error.status === 400 || error.status === 422) return error.message || t('error.generic')
    return t('error.server')
  }
  if (error instanceof TypeError) return t('error.network')
  return t('error.generic')
}
