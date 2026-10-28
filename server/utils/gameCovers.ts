import { readdirSync } from 'node:fs'
import { coversDir, coverPath } from './lang'
import { coverVariantForVersion, versionLabel } from '../../utils/gameVersions'

export type GameAppearance = {
  version: string
  label: string
  cover: string
}

let coverCache: Map<string, string> | null = null

export function getCoverMap(): Map<string, string> {
  if (coverCache) return coverCache

  coverCache = new Map()
  for (const file of readdirSync(coversDir())) {
    if (!file.endsWith('.png')) continue
    coverCache.set(file.replace(/\.png$/, ''), coverPath(file))
  }

  return coverCache
}

export function resolveVersionCover(version: string): string | null {
  const variant = coverVariantForVersion(version)
  if (!variant) return null
  return getCoverMap().get(variant) ?? null
}

export function resolveGameAppearances(versions: string[] | null | undefined): GameAppearance[] {
  return (Array.isArray(versions) ? versions : [])
    .map((version) => {
      const variant = coverVariantForVersion(version)
      return {
        version,
        label: variant ? versionLabel(variant) : version,
        cover: variant ? getCoverMap().get(variant) ?? null : null,
      }
    })
    .filter((game): game is GameAppearance => Boolean(game.cover))
}
