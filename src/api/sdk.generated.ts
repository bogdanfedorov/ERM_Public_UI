import type { MaybeOptionalInit } from 'openapi-fetch'
import type { Api } from './client'
import type { paths } from './schema'

export const createSdk = (api: Api) => ({
  attendance: {
    list: (init: MaybeOptionalInit<paths['/attendances'], 'get'>) => api.GET('/attendances', init),
    get: (init: MaybeOptionalInit<paths['/attendances/{attendance_id}'], 'get'>) => api.GET('/attendances/{attendance_id}', init),
  },
  account: {
    devSignIn: (init: MaybeOptionalInit<paths['/dev/session'], 'post'>) => api.POST('/dev/session', init),
    me: (init?: MaybeOptionalInit<paths['/me'], 'get'>) => api.GET('/me', init),
    signOut: (init?: MaybeOptionalInit<paths['/session'], 'delete'>) => api.DELETE('/session', init),
  },
  enrollment: {
    list: (init: MaybeOptionalInit<paths['/enrollments'], 'get'>) => api.GET('/enrollments', init),
    get: (init: MaybeOptionalInit<paths['/enrollments/{enrollment_id}'], 'get'>) => api.GET('/enrollments/{enrollment_id}', init),
    create: (init: MaybeOptionalInit<paths['/offerings/{offering_id}/enrollments'], 'post'>) => api.POST('/offerings/{offering_id}/enrollments', init),
  },
  fieldDefinition: {
    list: (init: MaybeOptionalInit<paths['/field_definitions'], 'get'>) => api.GET('/field_definitions', init),
    create: (init: MaybeOptionalInit<paths['/field_definitions'], 'post'>) => api.POST('/field_definitions', init),
    get: (init: MaybeOptionalInit<paths['/field_definitions/{field_definition_id}'], 'get'>) => api.GET('/field_definitions/{field_definition_id}', init),
    update: (init: MaybeOptionalInit<paths['/field_definitions/{field_definition_id}'], 'patch'>) => api.PATCH('/field_definitions/{field_definition_id}', init),
    archive: (init: MaybeOptionalInit<paths['/field_definitions/{field_definition_id}/archive'], 'post'>) => api.POST('/field_definitions/{field_definition_id}/archive', init),
    move: (init: MaybeOptionalInit<paths['/field_definitions/{field_definition_id}/move'], 'post'>) => api.POST('/field_definitions/{field_definition_id}/move', init),
    restore: (init: MaybeOptionalInit<paths['/field_definitions/{field_definition_id}/restore'], 'post'>) => api.POST('/field_definitions/{field_definition_id}/restore', init),
    fieldList: (init: MaybeOptionalInit<paths['/fields/{entity}'], 'get'>) => api.GET('/fields/{entity}', init),
  },
  accessGroup: {
    list: (init: MaybeOptionalInit<paths['/groups'], 'get'>) => api.GET('/groups', init),
    create: (init: MaybeOptionalInit<paths['/groups'], 'post'>) => api.POST('/groups', init),
    delete: (init: MaybeOptionalInit<paths['/groups/{access_group_id}'], 'delete'>) => api.DELETE('/groups/{access_group_id}', init),
    get: (init: MaybeOptionalInit<paths['/groups/{access_group_id}'], 'get'>) => api.GET('/groups/{access_group_id}', init),
    update: (init: MaybeOptionalInit<paths['/groups/{access_group_id}'], 'patch'>) => api.PATCH('/groups/{access_group_id}', init),
  },
  invite: {
    list: (init: MaybeOptionalInit<paths['/invites'], 'get'>) => api.GET('/invites', init),
    create: (init: MaybeOptionalInit<paths['/invites'], 'post'>) => api.POST('/invites', init),
    delete: (init: MaybeOptionalInit<paths['/invites/{invite_id}'], 'delete'>) => api.DELETE('/invites/{invite_id}', init),
    get: (init: MaybeOptionalInit<paths['/invites/{invite_id}'], 'get'>) => api.GET('/invites/{invite_id}', init),
    accept: (init: MaybeOptionalInit<paths['/invites/{invite_id}/accept'], 'post'>) => api.POST('/invites/{invite_id}/accept', init),
  },
  offering: {
    list: (init: MaybeOptionalInit<paths['/offerings'], 'get'>) => api.GET('/offerings', init),
    get: (init: MaybeOptionalInit<paths['/offerings/{offering_id}'], 'get'>) => api.GET('/offerings/{offering_id}', init),
  },
  person: {
    list: (init: MaybeOptionalInit<paths['/people'], 'get'>) => api.GET('/people', init),
    create: (init: MaybeOptionalInit<paths['/people'], 'post'>) => api.POST('/people', init),
    get: (init: MaybeOptionalInit<paths['/people/{person_id}'], 'get'>) => api.GET('/people/{person_id}', init),
    revoke: (init: MaybeOptionalInit<paths['/people/{person_id}/permit'], 'delete'>) => api.DELETE('/people/{person_id}/permit', init),
    setPermit: (init: MaybeOptionalInit<paths['/people/{person_id}/permit'], 'patch'>) => api.PATCH('/people/{person_id}/permit', init),
  },
  access: {
    permitList: (init: MaybeOptionalInit<paths['/permits'], 'get'>) => api.GET('/permits', init),
  },
  schedule: {
    list: (init: MaybeOptionalInit<paths['/schedule'], 'get'>) => api.GET('/schedule', init),
  },
  session: {
    list: (init: MaybeOptionalInit<paths['/sessions'], 'get'>) => api.GET('/sessions', init),
  },
})
