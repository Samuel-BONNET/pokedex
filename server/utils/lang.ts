import { join } from 'node:path'
import lang from '~/data/lang.json'

type NameKey = keyof typeof lang.text.games.names

function toFsPath(publicPath: string) {
    return join(process.cwd(), 'public', publicPath.replace(/^\/+/, ''))
}

export function coverPath(file: string) {
    return `${lang.img.games.covers.dir}/${file}`
}

export function gameName(nameEn: string) {
    return lang.text.games.names[nameEn as NameKey] ?? nameEn
}

export function typeIcon(type: string) {
    return `${lang.img.types.dir}/${type}${lang.img.types.ext}`
}

export function typesDir() {
    return toFsPath(lang.img.types.dir)
}

export function coversDir() {
    return toFsPath(lang.img.games.covers.dir)
}

export const img = lang.img
export const text = lang.text
