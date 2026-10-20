export interface paths {
    "/attendances": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List attendances the account can read. */
        get: operations["attendanceList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/attendances/{attendance_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read one attendance. */
        get: operations["attendanceGet"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/dev/session": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sign in as an existing account. Only when the server runs with APP_ENV=dev. */
        post: operations["devSignIn"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/enrollments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List enrollments the account can read. */
        get: operations["enrollmentList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/enrollments/{enrollment_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read one enrollment. */
        get: operations["enrollmentGet"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/field_definitions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List field_definitions the account can read. */
        get: operations["fieldDefinitionList"];
        put?: never;
        /** Add a field to an entity, after the existing ones. Administrators only. */
        post: operations["fieldDefinitionCreate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/field_definitions/{field_definition_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read one field_definition. */
        get: operations["fieldDefinitionGet"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Change whether a field is required, its searchability, or add enum options. Administrators only.
         * @description Options can only be added: records may already hold the old ones.
         */
        patch: operations["fieldDefinitionUpdate"];
        trace?: never;
    };
    "/field_definitions/{field_definition_id}/archive": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Hide a field from forms and lists. Its data stays. Administrators only. */
        post: operations["fieldDefinitionArchive"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/field_definitions/{field_definition_id}/move": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Put a field right after another one of the same entity, or first. Administrators only. */
        post: operations["fieldDefinitionMove"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/field_definitions/{field_definition_id}/restore": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Bring an archived field back. Administrators only. */
        post: operations["fieldDefinitionRestore"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/fields/{entity}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** FieldDefinition rows of an entity the account can read. */
        get: operations["fieldList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/groups": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List groups the account can read. */
        get: operations["accessGroupList"];
        put?: never;
        /** Create a group. Administrators only. */
        post: operations["accessGroupCreate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/groups/{access_group_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read one access_group. */
        get: operations["accessGroupGet"];
        put?: never;
        post?: never;
        /** Delete a group no account and no invitation holds. Administrators only; not for `admins`. */
        delete: operations["accessGroupDelete"];
        options?: never;
        head?: never;
        /**
         * Replace a group's name and rules. Administrators only; not for `admins`.
         * @description Changes take effect on the next request of every account holding the group.
         */
        patch: operations["accessGroupUpdate"];
        trace?: never;
    };
    "/invites": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List invites the account can read. */
        get: operations["inviteList"];
        put?: never;
        /**
         * Invite a person to sign in with the given groups and personal rules. Administrators only.
         * @description The response is the same whether or not an account with the identifier exists.
         */
        post: operations["inviteCreate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/invites/{invite_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read one invite. */
        get: operations["inviteGet"];
        put?: never;
        post?: never;
        /** Withdraw an invitation. Administrators only. */
        delete: operations["inviteDelete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/invites/{invite_id}/accept": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Accept an invitation addressed to one of the actor's verified identities. */
        post: operations["inviteAccept"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** The reading account, its tenants and its groups in them. */
        get: operations["me"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/offerings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List offerings the account can read. */
        get: operations["offeringList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/offerings/{offering_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read one offering. */
        get: operations["offeringGet"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/offerings/{offering_id}/enrollments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Enroll a person into an offering. */
        post: operations["enrollmentCreate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/people": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List people the account can read. */
        get: operations["personList"];
        put?: never;
        /**
         * Add a person with their custom fields.
         * @description `label` is rendered from the tenant's template. See [[19-staff-and-access#Creating an object]].
         */
        post: operations["personCreate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/people/{person_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read one person. */
        get: operations["personGet"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/people/{person_id}/permit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Remove the person's account from every group of the tenant. Administrators only. */
        delete: operations["personRevoke"];
        options?: never;
        head?: never;
        /** Replace the groups and personal rules of the person's account in the tenant. Administrators only. */
        patch: operations["personSetPermit"];
        trace?: never;
    };
    "/permits": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Per person with an account, its groups and personal rules in the tenant. Administrators only. */
        get: operations["permitList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/schedule": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Lesson occurrences within [from, to), overlaid with session state. */
        get: operations["scheduleList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/session": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Clear the session cookie. */
        delete: operations["signOut"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List sessions the account can read. */
        get: operations["sessionList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        Access: {
            groups: string[];
            /**
             * Format: uuid
             * @description The person whose account this is.
             */
            person_id: string;
            rules: components["schemas"]["Rule"][];
        };
        /** @description A preset of access an administrator creates and gives to accounts. */
        AccessGroup: {
            /**
             * Format: uuid
             * @description Identifier.
             */
            readonly id: string;
            /** @description The account's effective mode on this object: 4 read, 6 write. */
            readonly mode: number;
            /** @description Display name, e.g. Вчитель. */
            name: string;
            /** @description What the group may do, per resource. */
            rules: components["schemas"]["Rule"][];
            /** @description The administrators group; it cannot be changed or deleted. */
            readonly system?: boolean;
            /** @description Permission tags. */
            tags: string[];
            /**
             * Format: uuid
             * @description Tenant the object belongs to.
             */
            readonly tenant_id: string;
        };
        AccessGroupPage: {
            items: components["schemas"]["AccessGroup"][];
            /** @description Pass as cursor to get the next page; absent on the last page. */
            next_cursor?: string;
        };
        ActionResult: {
            /** @description What the action changed; shape depends on the action. */
            diff?: unknown;
            /** @description Action id; the Idempotency-Key when one was sent. */
            id: string;
            /** @enum {string} */
            outcome: "ok" | "denied" | "failed";
            trace_id: string;
            /** @description Action type, e.g. enrollment.create. */
            type: string;
        };
        /** @description The fact of a person attending a lesson. */
        Attendance: {
            /** @description Tenant-defined custom fields readable by the account. */
            attrs: {
                [key: string]: unknown;
            };
            /**
             * Format: uuid
             * @description Identifier.
             */
            readonly id: string;
            /** @description The account's effective mode on this object: 4 read, 6 write. */
            readonly mode: number;
            /**
             * Format: uuid
             * @description The offering the lesson belongs to.
             */
            offering_id: string;
            /**
             * Format: uuid
             * @description Who attended.
             */
            person_id: string;
            /**
             * @description Outcome of the attendance check.
             * @enum {string}
             */
            result: "present" | "absent" | "late";
            /**
             * Format: date-time
             * @description Start of the lesson.
             */
            start: string;
            /**
             * Format: uuid
             * @description The earlier record this one corrects.
             */
            supersedes?: string;
            /** @description Permission tags. */
            tags: string[];
            /**
             * Format: uuid
             * @description Tenant the object belongs to.
             */
            readonly tenant_id: string;
        };
        AttendancePage: {
            items: components["schemas"]["Attendance"][];
            /** @description Pass as cursor to get the next page; absent on the last page. */
            next_cursor?: string;
        };
        /** @description A person participating in an offering. */
        Enrollment: {
            /** @description Tenant-defined custom fields readable by the account. */
            attrs: {
                [key: string]: unknown;
            };
            /**
             * Format: uuid
             * @description Identifier.
             */
            readonly id: string;
            /** @description The account's effective mode on this object: 4 read, 6 write. */
            readonly mode: number;
            /**
             * Format: uuid
             * @description What the person is enrolled in.
             */
            offering_id: string;
            /** @description When the enrollment is in effect; open-ended while active. */
            period: components["schemas"]["Period"];
            /**
             * Format: uuid
             * @description The participant.
             */
            person_id: string;
            /**
             * @description Current state of the enrollment.
             * @default active
             * @enum {string}
             */
            status: "active" | "paused" | "ended";
            /** @description Permission tags. */
            tags: string[];
            /**
             * Format: uuid
             * @description Tenant the object belongs to.
             */
            readonly tenant_id: string;
        };
        EnrollmentPage: {
            items: components["schemas"]["Enrollment"][];
            /** @description Pass as cursor to get the next page; absent on the last page. */
            next_cursor?: string;
        };
        /** @description A custom field a business adds to an entity, such as `grade` on a person. */
        FieldDefinition: {
            /** @description The resource the field belongs to, e.g. person. */
            entity: string;
            /**
             * Format: uuid
             * @description Identifier.
             */
            readonly id: string;
            /**
             * @description Whether the field is searchable.
             * @default none
             * @enum {string}
             */
            index: "none" | "filter" | "text";
            /** @description Identifier inside the entity's attrs. */
            key: string;
            /** @description The account's effective mode on this object: 4 read, 6 write. */
            readonly mode: number;
            /** @description Allowed values of an enum field. */
            options?: string[];
            /** @description Place among the entity's fields, set by create and move. */
            readonly position?: string;
            /**
             * @description Whether a new record must have a value.
             * @default false
             */
            required: boolean;
            /**
             * @description Archived fields are hidden from forms but their data stays.
             * @default active
             * @enum {string}
             */
            readonly status: "active" | "archived";
            /** @description Permission tags. */
            tags: string[];
            /**
             * Format: uuid
             * @description Tenant the object belongs to.
             */
            readonly tenant_id: string;
            /** @description Name shown to people; empty means the key is shown. */
            title?: string;
            /**
             * @description Value type.
             * @enum {string}
             */
            type: "text" | "number" | "bool" | "date" | "enum";
            /**
             * @description Grows on every change.
             * @default 1
             */
            readonly version: number;
        };
        FieldDefinitionPage: {
            items: components["schemas"]["FieldDefinition"][];
            /** @description Pass as cursor to get the next page; absent on the last page. */
            next_cursor?: string;
        };
        FieldView: {
            /** @description The account may set this field when creating an object. */
            creatable: boolean;
            entity: string;
            /** Format: uuid */
            id: string;
            /** @enum {string} */
            index: "none" | "filter" | "text";
            key: string;
            options: string[];
            required: boolean;
            /** @enum {string} */
            status: "active" | "archived";
            /** @description Name shown to people; empty means the key is shown. */
            title: string;
            /** @enum {string} */
            type: "text" | "number" | "bool" | "date" | "enum";
            version: number;
            /** @description The account may set this field when updating an object. */
            writable: boolean;
        };
        /** @description An invitation for a person to sign in to the tenant with the given groups. */
        Invite: {
            /**
             * Format: uuid
             * @description Identifier.
             */
            readonly id: string;
            /** @description Normalized email or phone the invitation is addressed to. */
            identifier: string;
            /** @description The account's effective mode on this object: 4 read, 6 write. */
            readonly mode: number;
            /** @description Groups and personal rules the person gets on accepting. */
            permit: components["schemas"]["Permit"];
            /**
             * Format: uuid
             * @description The person the invitation is for.
             */
            person_id: string;
            /** @description Permission tags. */
            tags: string[];
            /**
             * Format: uuid
             * @description Tenant the object belongs to.
             */
            readonly tenant_id: string;
        };
        InvitePage: {
            items: components["schemas"]["Invite"][];
            /** @description Pass as cursor to get the next page; absent on the last page. */
            next_cursor?: string;
        };
        Me: {
            account: {
                /** Format: uuid */
                id: string;
                identities: {
                    identifier: string;
                    /** @enum {string} */
                    kind: "email" | "phone";
                    verified: boolean;
                }[];
            };
            /** @description Open invitations addressed to the account's verified identities. */
            invitations: {
                /** Format: uuid */
                invite_id: string;
                /** Format: uuid */
                tenant_id: string;
            }[];
            tenants: {
                /** @description The account may manage access in this tenant. */
                admin: boolean;
                groups: {
                    id: string;
                    name: string;
                }[];
                /** Format: uuid */
                id: string;
                /**
                 * Format: uuid
                 * @description The account's person in this tenant.
                 */
                person_id: string;
                /** @enum {string} */
                status: "active" | "suspended" | "archived";
            }[];
        };
        Occurrence: {
            /** @description Bitmask of rights: 8 read, 4 create, 2 update, 1 delete. */
            mode: number;
            /** Format: uuid */
            offering_id: string;
            /**
             * Format: date-time
             * @description original_start of the session.
             */
            start: string;
            /** @enum {string} */
            status: "scheduled" | "cancelled" | "rescheduled";
        };
        /** @description What the business offers — a service template with an optional schedule. */
        Offering: {
            /** @description Tenant-defined custom fields readable by the account. */
            attrs: {
                [key: string]: unknown;
            };
            /**
             * @description Maximum number of participants.
             * @default 1
             */
            capacity: number;
            /**
             * Format: uuid
             * @description Identifier.
             */
            readonly id: string;
            /** @description Business tag for the offering, e.g. course or consultation. */
            kind: string;
            /** @description The account's effective mode on this object: 4 read, 6 write. */
            readonly mode: number;
            /** @description Scheduling rules; empty for a one-off offering. */
            rules?: components["schemas"]["ScheduleRule"][];
            /** @description Permission tags. */
            tags: string[];
            /**
             * Format: uuid
             * @description Tenant the object belongs to.
             */
            readonly tenant_id: string;
        };
        OfferingPage: {
            items: components["schemas"]["Offering"][];
            /** @description Pass as cursor to get the next page; absent on the last page. */
            next_cursor?: string;
        };
        Period: {
            /** Format: date-time */
            from: string;
            /** Format: date-time */
            to?: string;
        };
        Permit: {
            /** @description Ids of the tenant's groups. */
            groups: string[];
            /** @description Personal rules of the account. */
            rules: components["schemas"]["Rule"][];
        };
        /** @description A real person within a tenant — student, parent or teacher. */
        Person: {
            /** @description Tenant-defined custom fields readable by the account. */
            attrs: {
                [key: string]: unknown;
            };
            /**
             * Format: uuid
             * @description Identifier.
             */
            readonly id: string;
            /** @description Display name, recomputed from the tenant's label template on every write. */
            readonly label?: string;
            /** @description The account's effective mode on this object: 4 read, 6 write. */
            readonly mode: number;
            /** @description Permission tags. */
            tags: string[];
            /**
             * Format: uuid
             * @description Tenant the object belongs to.
             */
            readonly tenant_id: string;
        };
        PersonPage: {
            items: components["schemas"]["Person"][];
            /** @description Pass as cursor to get the next page; absent on the last page. */
            next_cursor?: string;
        };
        Rule: {
            fields?: {
                read: string[];
                write: string[];
            };
            /** @description Bitmask of rights: 8 read, 4 create, 2 update, 1 delete. */
            mode: number;
            /** @description A resource type, or * for every type. */
            resource: string;
            /**
             * @description Every object of the type, or only objects tagged with the group. Personal rules are always all.
             * @enum {string}
             */
            scope: "all" | "tagged";
        };
        ScheduleRule: {
            /** Format: date-time */
            from: string;
            /** @description RFC 5545 recurrence rule. */
            rrule: string;
        };
        /** @description A specific lesson of an offering that has state. */
        Session: {
            /** @description Tenant-defined custom fields readable by the account. */
            attrs: {
                [key: string]: unknown;
            };
            /** @description The account's effective mode on this object: 4 read, 6 write. */
            readonly mode: number;
            /**
             * Format: uuid
             * @description The offering this lesson belongs to.
             */
            offering_id: string;
            /**
             * Format: date-time
             * @description Start of the occurrence as computed from the schedule.
             */
            original_start: string;
            /**
             * @description Current state of the lesson.
             * @default scheduled
             * @enum {string}
             */
            status: "scheduled" | "cancelled" | "rescheduled";
            /** @description Permission tags. */
            tags: string[];
            /**
             * Format: uuid
             * @description Tenant the object belongs to.
             */
            readonly tenant_id: string;
        };
        SessionPage: {
            items: components["schemas"]["Session"][];
            /** @description Pass as cursor to get the next page; absent on the last page. */
            next_cursor?: string;
        };
    };
    responses: {
        /** @description The actor may not run this action on the target. */
        ActionDenied: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ActionResult"];
            };
        };
        /** @description The action ran. */
        ActionOK: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ActionResult"];
            };
        };
        /** @description Malformed query parameter or missing header. */
        BadQuery: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "text/plain": string;
            };
        };
        /** @description Malformed body, a body field that conflicts with a path param, or a missing X-Tenant-ID. */
        BadRequest: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "text/plain": string;
            };
        };
        /** @description An internal failure. The text is always internal error; details are only in the server log. */
        InternalError: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "text/plain": string;
            };
        };
        /** @description No such object, or the account may not read it. */
        NotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "text/plain": string;
            };
        };
        /** @description The account is not a member of the tenant. */
        NotMember: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "text/plain": string;
            };
        };
        /** @description No session cookie, an invalid or expired one, or the account does not exist. */
        Unauthorized: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "text/plain": string;
            };
        };
        /** @description The input failed validation or a business rule; the text is the reason. */
        Unprocessable: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "text/plain": string;
            };
        };
    };
    parameters: {
        /** @description Repeating a request with the same key does not repeat the action. */
        IdempotencyKey: string;
        /** @description Tenant to read from. */
        ReadTenantID: string;
        /** @description Tenant the action runs in. */
        TenantID: string;
        /** @description Links actions belonging to the same request. */
        TraceID: string;
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    attendanceList: {
        parameters: {
            query?: {
                /** @description Page size. */
                limit?: number;
                /** @description next_cursor of the previous page. */
                cursor?: string;
                /** @description Only objects with this person_id. */
                person_id?: string;
                /** @description Only objects with this offering_id. */
                offering_id?: string;
                /** @description Only objects with this supersedes. */
                supersedes?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List attendances the account can read. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AttendancePage"];
                };
            };
            400: components["responses"]["BadQuery"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["NotMember"];
            500: components["responses"]["InternalError"];
        };
    };
    attendanceGet: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                attendance_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Read one attendance. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Attendance"];
                };
            };
            400: components["responses"]["BadQuery"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["NotMember"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["InternalError"];
        };
    };
    devSignIn: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** Format: uuid */
                    account_id: string;
                };
            };
        };
        responses: {
            /** @description The session cookie is set. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadQuery"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    enrollmentList: {
        parameters: {
            query?: {
                /** @description Page size. */
                limit?: number;
                /** @description next_cursor of the previous page. */
                cursor?: string;
                /** @description Only objects with this person_id. */
                person_id?: string;
                /** @description Only objects with this offering_id. */
                offering_id?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List enrollments the account can read. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EnrollmentPage"];
                };
            };
            400: components["responses"]["BadQuery"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["NotMember"];
            500: components["responses"]["InternalError"];
        };
    };
    enrollmentGet: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                enrollment_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Read one enrollment. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Enrollment"];
                };
            };
            400: components["responses"]["BadQuery"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["NotMember"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["InternalError"];
        };
    };
    fieldDefinitionList: {
        parameters: {
            query?: {
                /** @description Page size. */
                limit?: number;
                /** @description next_cursor of the previous page. */
                cursor?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List field_definitions the account can read. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FieldDefinitionPage"];
                };
            };
            400: components["responses"]["BadQuery"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["NotMember"];
            500: components["responses"]["InternalError"];
        };
    };
    fieldDefinitionCreate: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description An entity with custom fields. */
                    entity: string;
                    /**
                     * @default none
                     * @enum {string}
                     */
                    index?: "none" | "filter" | "text";
                    /** @description Lowercase letters, digits and `_`, starting with a letter. */
                    key: string;
                    /** @description Required for `enum`, forbidden for other types. */
                    options?: string[];
                    /** @default false */
                    required?: boolean;
                    title?: string;
                    /** @enum {string} */
                    type: "text" | "number" | "bool" | "date" | "enum";
                };
            };
        };
        responses: {
            200: components["responses"]["ActionOK"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["ActionDenied"];
            422: components["responses"]["Unprocessable"];
            500: components["responses"]["InternalError"];
        };
    };
    fieldDefinitionGet: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                field_definition_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Read one field_definition. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FieldDefinition"];
                };
            };
            400: components["responses"]["BadQuery"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["NotMember"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["InternalError"];
        };
    };
    fieldDefinitionUpdate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                field_definition_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @enum {string} */
                    index: "none" | "filter" | "text";
                    /** @description The full list, including the existing options. */
                    options?: string[];
                    required: boolean;
                    /** @description Replaces the title; empty clears it. */
                    title?: string;
                };
            };
        };
        responses: {
            200: components["responses"]["ActionOK"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["ActionDenied"];
            422: components["responses"]["Unprocessable"];
            500: components["responses"]["InternalError"];
        };
    };
    fieldDefinitionArchive: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                field_definition_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["ActionOK"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["ActionDenied"];
            422: components["responses"]["Unprocessable"];
            500: components["responses"]["InternalError"];
        };
    };
    fieldDefinitionMove: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                field_definition_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * Format: uuid
                     * @description The field to follow; absent means first.
                     */
                    after_id?: string;
                };
            };
        };
        responses: {
            200: components["responses"]["ActionOK"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["ActionDenied"];
            422: components["responses"]["Unprocessable"];
            500: components["responses"]["InternalError"];
        };
    };
    fieldDefinitionRestore: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                field_definition_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["ActionOK"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["ActionDenied"];
            422: components["responses"]["Unprocessable"];
            500: components["responses"]["InternalError"];
        };
    };
    fieldList: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                entity: "access_group" | "attendance" | "enrollment" | "field_definition" | "invite" | "offering" | "person" | "session";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description FieldDefinition rows of an entity the account can read. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["FieldView"][];
                        /** @description Pass as cursor to get the next page; absent on the last page. */
                        next_cursor?: string;
                    };
                };
            };
            400: components["responses"]["BadQuery"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["NotMember"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["InternalError"];
        };
    };
    accessGroupList: {
        parameters: {
            query?: {
                /** @description Page size. */
                limit?: number;
                /** @description next_cursor of the previous page. */
                cursor?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List groups the account can read. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccessGroupPage"];
                };
            };
            400: components["responses"]["BadQuery"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["NotMember"];
            500: components["responses"]["InternalError"];
        };
    };
    accessGroupCreate: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    name: string;
                    /** @description At least one rule. */
                    rules: components["schemas"]["Rule"][];
                };
            };
        };
        responses: {
            200: components["responses"]["ActionOK"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["ActionDenied"];
            422: components["responses"]["Unprocessable"];
            500: components["responses"]["InternalError"];
        };
    };
    accessGroupGet: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                access_group_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Read one access_group. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccessGroup"];
                };
            };
            400: components["responses"]["BadQuery"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["NotMember"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["InternalError"];
        };
    };
    accessGroupDelete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                access_group_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["ActionOK"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["ActionDenied"];
            422: components["responses"]["Unprocessable"];
            500: components["responses"]["InternalError"];
        };
    };
    accessGroupUpdate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                access_group_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    name: string;
                    /** @description At least one rule. */
                    rules: components["schemas"]["Rule"][];
                };
            };
        };
        responses: {
            200: components["responses"]["ActionOK"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["ActionDenied"];
            422: components["responses"]["Unprocessable"];
            500: components["responses"]["InternalError"];
        };
    };
    inviteList: {
        parameters: {
            query?: {
                /** @description Page size. */
                limit?: number;
                /** @description next_cursor of the previous page. */
                cursor?: string;
                /** @description Only objects with this person_id. */
                person_id?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List invites the account can read. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvitePage"];
                };
            };
            400: components["responses"]["BadQuery"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["NotMember"];
            500: components["responses"]["InternalError"];
        };
    };
    inviteCreate: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description Email or phone. */
                    identifier: string;
                    /** @description Groups and personal rules; at least one of either. */
                    permit: components["schemas"]["Permit"];
                    /** Format: uuid */
                    person_id: string;
                };
            };
        };
        responses: {
            200: components["responses"]["ActionOK"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["ActionDenied"];
            422: components["responses"]["Unprocessable"];
            500: components["responses"]["InternalError"];
        };
    };
    inviteGet: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                invite_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Read one invite. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Invite"];
                };
            };
            400: components["responses"]["BadQuery"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["NotMember"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["InternalError"];
        };
    };
    inviteDelete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                invite_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["ActionOK"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["ActionDenied"];
            422: components["responses"]["Unprocessable"];
            500: components["responses"]["InternalError"];
        };
    };
    inviteAccept: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                invite_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["ActionOK"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["ActionDenied"];
            422: components["responses"]["Unprocessable"];
            500: components["responses"]["InternalError"];
        };
    };
    me: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The reading account, its tenants and its groups in them. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Me"];
                };
            };
            400: components["responses"]["BadQuery"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["NotMember"];
            500: components["responses"]["InternalError"];
        };
    };
    offeringList: {
        parameters: {
            query?: {
                /** @description Page size. */
                limit?: number;
                /** @description next_cursor of the previous page. */
                cursor?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List offerings the account can read. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OfferingPage"];
                };
            };
            400: components["responses"]["BadQuery"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["NotMember"];
            500: components["responses"]["InternalError"];
        };
    };
    offeringGet: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                offering_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Read one offering. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Offering"];
                };
            };
            400: components["responses"]["BadQuery"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["NotMember"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["InternalError"];
        };
    };
    enrollmentCreate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                offering_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** Format: uuid */
                    person_id: string;
                };
            };
        };
        responses: {
            200: components["responses"]["ActionOK"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["ActionDenied"];
            422: components["responses"]["Unprocessable"];
            500: components["responses"]["InternalError"];
        };
    };
    personList: {
        parameters: {
            query?: {
                /** @description Page size. */
                limit?: number;
                /** @description next_cursor of the previous page. */
                cursor?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List people the account can read. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PersonPage"];
                };
            };
            400: components["responses"]["BadQuery"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["NotMember"];
            500: components["responses"]["InternalError"];
        };
    };
    personCreate: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description Values of the tenant's person fields. */
                    attrs: {
                        [key: string]: unknown;
                    };
                };
            };
        };
        responses: {
            200: components["responses"]["ActionOK"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["ActionDenied"];
            422: components["responses"]["Unprocessable"];
            500: components["responses"]["InternalError"];
        };
    };
    personGet: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                person_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Read one person. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Person"];
                };
            };
            400: components["responses"]["BadQuery"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["NotMember"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["InternalError"];
        };
    };
    personRevoke: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                person_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["ActionOK"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["ActionDenied"];
            422: components["responses"]["Unprocessable"];
            500: components["responses"]["InternalError"];
        };
    };
    personSetPermit: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                person_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description Groups and personal rules; at least one of either. */
                    permit: components["schemas"]["Permit"];
                };
            };
        };
        responses: {
            200: components["responses"]["ActionOK"];
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["ActionDenied"];
            422: components["responses"]["Unprocessable"];
            500: components["responses"]["InternalError"];
        };
    };
    permitList: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Per person with an account, its groups and personal rules in the tenant. Administrators only. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["Access"][];
                        /** @description Pass as cursor to get the next page; absent on the last page. */
                        next_cursor?: string;
                    };
                };
            };
            400: components["responses"]["BadQuery"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["NotMember"];
            500: components["responses"]["InternalError"];
        };
    };
    scheduleList: {
        parameters: {
            query?: {
                /** @description Window start, inclusive. */
                from?: string;
                /** @description Window end, exclusive; at most 366 days after from. */
                to?: string;
                /** @description Only these offerings; repeatable. */
                offering_id?: string[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Lesson occurrences within [from, to), overlaid with session state. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["Occurrence"][];
                        /** @description Pass as cursor to get the next page; absent on the last page. */
                        next_cursor?: string;
                    };
                };
            };
            400: components["responses"]["BadQuery"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["NotMember"];
            500: components["responses"]["InternalError"];
        };
    };
    signOut: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The cookie is cleared. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    sessionList: {
        parameters: {
            query?: {
                /** @description Page size. */
                limit?: number;
                /** @description next_cursor of the previous page. */
                cursor?: string;
                /** @description Only objects with this offering_id. */
                offering_id?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List sessions the account can read. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SessionPage"];
                };
            };
            400: components["responses"]["BadQuery"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["NotMember"];
            500: components["responses"]["InternalError"];
        };
    };
}
