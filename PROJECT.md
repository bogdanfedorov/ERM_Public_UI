## API
  - [file:openapi](../backend/api/openapi.json)

## feature
### auth
#### DevLogin
  - [api] getMe() : [SDK.account.me](#sdk)

### fields
#### FieldSettingsPage
  - [api] getFields(entity) : [SDK.fieldDefinition.fieldList](#sdk)
  - [mutate] createField(body) : [SDK.fieldDefinition.create](#sdk)
  - [mutate] updateField(body) : [SDK.fieldDefinition.update](#sdk)
  - [mutate] archiveField(body) : [SDK.fieldDefinition.archive](#sdk)
  - [mutate] restoreField(body) : [SDK.fieldDefinition.restore](#sdk)
  - [mutate] moveField(body) : [SDK.fieldDefinition.move](#sdk)

## Router
- /login
  - name login
  - component [DevLogin](#devlogin)
- settings/fields/:entity?
  - name fields
  - component [FieldSettingsPage](#fieldsettingspage)
