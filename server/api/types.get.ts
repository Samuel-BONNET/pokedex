import { readdirSync } from 'node:fs'
import { join } from 'node:path'

const TYPES_DIR = join(process.cwd(), 'public', 'img', 'types')

export default defineEventHandler(() =>
    readdirSync(TYPES_DIR)
        .filter(f => f.endsWith('.png'))
        .sort()
)
