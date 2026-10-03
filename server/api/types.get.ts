import { readdirSync } from 'node:fs'
import { typesDir, typeIcon, img } from '../utils/lang'

export default defineEventHandler(() =>
    readdirSync(typesDir())
        .filter(f => f.endsWith(img.types.ext))
        .sort()
        .map(f => {
            const name = f.slice(0, -img.types.ext.length)
            return { name, icon: typeIcon(name) }
        })
)
