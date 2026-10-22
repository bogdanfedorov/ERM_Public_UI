import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const backend = fileURLToPath(new URL('../../backend', import.meta.url))
const seed = readFileSync(new URL('./seed.sql', import.meta.url))

const psql = (input: string | Buffer) =>
  execFileSync(
    'docker',
    [
      'compose',
      'exec',
      '-T',
      'db',
      'sh',
      '-c',
      'psql -q -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"',
    ],
    {
      cwd: backend,
      input,
    },
  )

export default () => {
  psql(`delete from account_permit; delete from invite;
    delete from field_definition where key like 'e2e\\_%';
    delete from access_group where id::text not like '00000000-0000-4000-8000-%';
    delete from person where id::text not like '00000000-0000-4000-8000-%';`)
  psql(seed)
  psql(`delete from enrollment where id::text not like '00000000-0000-4000-8000-00000000d%';`)
}
