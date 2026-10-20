## API
  - [file:openapi](../backend/api/openapi.json)

## feature
### auth
#### DevLogin
  - [item] getMe() : [SDK.account.me](#sdk)

### fields
#### FieldSettingsPage
  - [item] getFields(entity) : [SDK.fieldDefinition.fieldList](#sdk)
  - [mutate] createField(body) : [SDK.fieldDefinition.create](#sdk)
  - [mutate] updateField(body) : [SDK.fieldDefinition.update](#sdk)
  - [mutate] archiveField(body) : [SDK.fieldDefinition.archive](#sdk)
  - [mutate] restoreField(body) : [SDK.fieldDefinition.restore](#sdk)
  - [mutate] moveField(body) : [SDK.fieldDefinition.move](#sdk)

### schedule
#### TodayPage
  - [item] getLessons(window) : [SDK.schedule.list](#sdk)

#### WeekPage
  - [item] getLessons(window) : [SDK.schedule.list](#sdk)

### people
#### PeoplePage
  - [pages] getPeople() : [SDK.person.list](#sdk)

#### PersonPage
  - [item] getPerson(id) : [SDK.person.get](#sdk)
  - [item] getEnrollments(filter) : [SDK.enrollment.list](#sdk)
  - [item] getAttendances(filter) : [SDK.attendance.list](#sdk)
  - [item] getFields(entity) : [SDK.fieldDefinition.fieldList](#sdk)
  - [item] getPermits() : [SDK.access.permitList](#sdk)
  - [item] getInvites() : [SDK.invite.list](#sdk)
  - [mutate] createPerson(body) : [SDK.person.create](#sdk)
  - [mutate] invite(body) : [SDK.invite.create](#sdk)
  - [mutate] setPermit(body) : [SDK.person.setPermit](#sdk)
  - [mutate] revoke(body) : [SDK.person.revoke](#sdk)

### staff
#### StaffPage
  - [item] getPermits() : [SDK.access.permitList](#sdk)
  - [item] getInvites() : [SDK.invite.list](#sdk)
  - [mutate] createPerson(body) : [SDK.person.create](#sdk)
  - [mutate] invite(body) : [SDK.invite.create](#sdk)
  - [mutate] withdrawInvite(body) : [SDK.invite.delete](#sdk)
  - [mutate] setPermit(body) : [SDK.person.setPermit](#sdk)
  - [mutate] revoke(body) : [SDK.person.revoke](#sdk)

#### GroupsPage
  - [item] getGroups() : [SDK.accessGroup.list](#sdk)
  - [mutate] createGroup(body) : [SDK.accessGroup.create](#sdk)
  - [mutate] updateGroup(body) : [SDK.accessGroup.update](#sdk)
  - [mutate] deleteGroup(body) : [SDK.accessGroup.delete](#sdk)

### offerings
#### OfferingsPage
  - [pages] getOfferings() : [SDK.offering.list](#sdk)

#### OfferingPage
  - [item] getOffering(id) : [SDK.offering.get](#sdk)
  - [item] getFields(entity) : [SDK.fieldDefinition.fieldList](#sdk)
  - [item] getEnrollments(filter) : [SDK.enrollment.list](#sdk)
  - [item] getLessons(window) : [SDK.schedule.list](#sdk)
  - [pages] getPeople() : [SDK.person.list](#sdk)
  - [mutate] enroll(body) : [SDK.enrollment.create](#sdk)

### tenant
#### TenantPicker
  - [item] getMe() : [SDK.account.me](#sdk)
  - [mutate] acceptInvite(tenantId, body) : [SDK.invite.accept](#sdk)

## Router
- /
  - name tenants
  - component [TenantPicker](#tenantpicker)
- /login
  - name login
  - component [DevLogin](#devlogin)
- settings/fields/:entity?
  - name fields
  - component [FieldSettingsPage](#fieldsettingspage)
- today
  - name today
  - component [TodayPage](#todaypage)
- schedule
  - name schedule
  - component [WeekPage](#weekpage)
- people
  - name people
  - component [PeoplePage](#peoplepage)
- people/:id
  - name person
  - component [PersonPage](#personpage)
- staff
  - name staff
  - component [StaffPage](#staffpage)
- staff/groups
  - name groups
  - component [GroupsPage](#groupspage)
- offerings
  - name offerings
  - component [OfferingsPage](#offeringspage)
- offerings/:id
  - name offering
  - component [OfferingPage](#offeringpage)
