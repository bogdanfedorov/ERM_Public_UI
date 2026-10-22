import { copyFileSync } from 'node:fs'

const [source, target] = process.argv.slice(2)
copyFileSync(source, target)
