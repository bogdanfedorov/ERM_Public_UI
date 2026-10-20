import type { Api } from './client'

export const createSdk = (api: Api) => ({
  attendance: {
    list: (init?: Parameters<Api['GET']>[1]) => api.GET('/attendances', init),
    get: (init?: Parameters<Api['GET']>[1]) => api.GET('/attendances/{attendance_id}', init),
  },
  account: {
    devSignIn: (init?: Parameters<Api['POST']>[1]) => api.POST('/dev/session', init),
    me: (init?: Parameters<Api['GET']>[1]) => api.GET('/me', init),
    signOut: (init?: Parameters<Api['DELETE']>[1]) => api.DELETE('/session', init),
  },
  enrollment: {
    list: (init?: Parameters<Api['GET']>[1]) => api.GET('/enrollments', init),
    get: (init?: Parameters<Api['GET']>[1]) => api.GET('/enrollments/{enrollment_id}', init),
    create: (init?: Parameters<Api['POST']>[1]) => api.POST('/offerings/{offering_id}/enrollments', init),
  },
  fieldDefinition: {
    list: (init?: Parameters<Api['GET']>[1]) => api.GET('/field_definitions', init),
    create: (init?: Parameters<Api['POST']>[1]) => api.POST('/field_definitions', init),
    get: (init?: Parameters<Api['GET']>[1]) => api.GET('/field_definitions/{field_definition_id}', init),
    update: (init?: Parameters<Api['PATCH']>[1]) => api.PATCH('/field_definitions/{field_definition_id}', init),
    archive: (init?: Parameters<Api['POST']>[1]) => api.POST('/field_definitions/{field_definition_id}/archive', init),
    move: (init?: Parameters<Api['POST']>[1]) => api.POST('/field_definitions/{field_definition_id}/move', init),
    restore: (init?: Parameters<Api['POST']>[1]) => api.POST('/field_definitions/{field_definition_id}/restore', init),
    fieldList: (init?: Parameters<Api['GET']>[1]) => api.GET('/fields/{entity}', init),
  },
  accessGroup: {
    list: (init?: Parameters<Api['GET']>[1]) => api.GET('/groups', init),
    create: (init?: Parameters<Api['POST']>[1]) => api.POST('/groups', init),
    delete: (init?: Parameters<Api['DELETE']>[1]) => api.DELETE('/groups/{access_group_id}', init),
    get: (init?: Parameters<Api['GET']>[1]) => api.GET('/groups/{access_group_id}', init),
    update: (init?: Parameters<Api['PATCH']>[1]) => api.PATCH('/groups/{access_group_id}', init),
  },
  invite: {
    list: (init?: Parameters<Api['GET']>[1]) => api.GET('/invites', init),
    create: (init?: Parameters<Api['POST']>[1]) => api.POST('/invites', init),
    delete: (init?: Parameters<Api['DELETE']>[1]) => api.DELETE('/invites/{invite_id}', init),
    get: (init?: Parameters<Api['GET']>[1]) => api.GET('/invites/{invite_id}', init),
    accept: (init?: Parameters<Api['POST']>[1]) => api.POST('/invites/{invite_id}/accept', init),
  },
  offering: {
    list: (init?: Parameters<Api['GET']>[1]) => api.GET('/offerings', init),
    get: (init?: Parameters<Api['GET']>[1]) => api.GET('/offerings/{offering_id}', init),
  },
  person: {
    list: (init?: Parameters<Api['GET']>[1]) => api.GET('/people', init),
    create: (init?: Parameters<Api['POST']>[1]) => api.POST('/people', init),
    get: (init?: Parameters<Api['GET']>[1]) => api.GET('/people/{person_id}', init),
    revoke: (init?: Parameters<Api['DELETE']>[1]) => api.DELETE('/people/{person_id}/permit', init),
    setPermit: (init?: Parameters<Api['PATCH']>[1]) => api.PATCH('/people/{person_id}/permit', init),
  },
  access: {
    permitList: (init?: Parameters<Api['GET']>[1]) => api.GET('/permits', init),
  },
  schedule: {
    list: (init?: Parameters<Api['GET']>[1]) => api.GET('/schedule', init),
  },
  session: {
    list: (init?: Parameters<Api['GET']>[1]) => api.GET('/sessions', init),
  },
})
