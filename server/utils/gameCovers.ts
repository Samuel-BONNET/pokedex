import type { Prisma } from '@prisma/client'
import { readdirSync } from 'node:fs'
import { coversDir, coverPath } from './lang'
import { prisma } from './prisma'
import {
  VERSION_TO_COVER_VARIANT,
  coverVariantForVersion,
  getBaseFromVariant,
  versionLabel,
} from '../../utils/gameVersions'

export type GameAppearance = {
  id: number
  version: string
  variant: string
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

let coversByBaseCache: Map<string, { name: string; sprite: string }[]> | null = null
let gameCatalogPromise: Promise<Map<string, GameAppearance>> | null = null

export function getCoversByBase(): Map<string, { name: string; sprite: string }[]> {
  if (coversByBaseCache) return coversByBaseCache

  coversByBaseCache = new Map()
  for (const [name, sprite] of getCoverMap()) {
    const base = getBaseFromVariant(name)
    const list = coversByBaseCache.get(base) ?? []
    list.push({ name, sprite })
    coversByBaseCache.set(base, list)
  }

  return coversByBaseCache
}

export function getGameCatalog(): Promise<Map<string, GameAppearance>> {
  if (!gameCatalogPromise) {
    gameCatalogPromise = buildGameCatalog().catch((error) => {
      gameCatalogPromise = null
      throw error
    })
  }
  return gameCatalogPromise
}

async function buildGameCatalog(): Promise<Map<string, GameAppearance>> {
  const games = await prisma.game.findMany({
    select: { id: true, nameEn: true },
  })
  const gameIdByName = new Map(games.map((game) => [game.nameEn, game.id]))
  const covers = getCoverMap()
  const catalog = new Map<string, GameAppearance>()

  for (const [version, variant] of Object.entries(VERSION_TO_COVER_VARIANT)) {
    const id = gameIdByName.get(getBaseFromVariant(variant))
    const cover = covers.get(variant)
    if (id === undefined || !cover) continue

    catalog.set(version, {
      id,
      version,
      variant,
      label: versionLabel(variant),
      cover,
    })
  }

  return catalog
}

export async function resolveGameAppearances(
    versions: Prisma.JsonValue | null | undefined,
): Promise<GameAppearance[]> {
  const catalog = await getGameCatalog()

  return (Array.isArray(versions) ? versions : [])
      .filter((version): version is string => typeof version === 'string')
      .map((version) => catalog.get(version))
      .filter((game): game is GameAppearance => game !== undefined)
}