# Project MJS PPD

задача розробити cli тулзу яка може генерувати і інжекктити апі в проекті 

## Script args

-f [FILE_NAME] - (Optional) path to [spec file](#Specification_file)  default ./ PROJECT.md

-o [FILE_NAME] - (Optional) path to write log if not provide use standart output

-gT - (Optional) Generate ts types from [API_LINK](#API_LINK)

-gS - (Optional) Generate ts SDK from [API_LINK](#API_LINK) ad types

-gI - (Optional) Generate or regenerate props type and props injectin see more on [Feture](#feture) and [Routting](#crete-router-and-props-injection)

-vT -(Optional) only validate type mathc curent and from [API_LINK](#API_LINK)
-vS -(Optional) only validate sdk mathc curent and from [API_LINK](#API_LINK).
-vI -(Optional) only validate props from spec file and in code basee 

## Specification file

This is a specific file written in Markdown that describes key aspects of the project.

### Structure: 

#### API LINK
A single project may contain multiple API references—for instance, in a microservices architecture—or perhaps one internal API along with several external ones.
```md
## API
  - [file:openapi](../backend/api/openapi.json) as local
```

#### Feture
This structure describes which endpoints are required by which feature components, and how to map them.

```md 
## fetures
### auth
#### Login
  [api] getMe() : [SDK.account.me](#sdk)
```
1. This code say we have `fetures` in `auth` sub-domain and feature name a `DevLogin`, and also say path to file `./src/features/auth/DevLogin.vue`. 

2. Row `[api] getMe() : [SDK.account.me](#sdk::local)` 
    1. with api (`[api]`) 
    2. with sdk method `SDK.account.me` 
    3. from sdk `#sdk::local`.
    4. inject as `getMe()`

Script add to file 1 (`./src/features/auth/DevLogin.vue`) next part 
```ts
const props = defineProps<{
  [$2.1$]: {
    [$2.4$]: () => [$Return type of unction 2.2 from sdk 2.3 $]
  }
}>()
```

#### Crete router and props injection
This parameter describes the logic of the built API. suport md links

```md
## Router
  - /login
    - name login
    - component [Login](#login)
```

component we know path [see more rule](#feture) 
what props we also know wrom (#feture) and what sdk method use also from  (#feture) 
```ts
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login'
      , name: 'login'
      , component: () => import('../features/auth/DevLogin.vue')
      , props: () => ({ 
        api: { 
          getMe: () => useQuery(queryOptions(
            { queryKey: ['me']
            , queryFn: () => unwrap(SDK.account.me())
            , staleTime: 60_000
          })) 
      }}) 
    }]
    })
```