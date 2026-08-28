import { prisma } from './prisma'
import { getOrderedGameNames, findSpriteByOrder } from "./sprite"

export interface EvolutionStage {
    id: number
    pokeNumber: number
    nameFr: string
    nameEn: string
    isOwned: boolean
    isShiny: boolean
    currentSprite: string | null
}


async function loadStage(pokeNumber: number, idUser: number, orderedNames: string[]) {
    const p = await prisma.pokemon.findUnique({
        where: { pokeNumber },
        include: {
            statuts: { where: { idUser: { in: [idUser, 0] } }, select: { idUser: true, isOwned: true, isShiny: true } },
            pokemonPreferences: { where: { idUser: { in: [idUser, 0] } }, select: { idUser: true, currentSprite: true } },
        },
    })
    if (!p) return null
    return {
        id: p.id,
        pokeNumber: p.pokeNumber,
        nameFr: p.nameFr,
        nameEn: p.nameEn,
        isOwned: p.statuts.find(s => s.idUser === idUser)?.isOwned ?? false,
        isShiny: p.statuts.find(s => s.idUser === idUser)?.isShiny ?? false,
        currentSprite: p.pokemonPreferences.find(s => s.idUser === idUser)?.currentSprite ?? findSpriteByOrder(p.availableGames, orderedNames) ?? p.pokemonPreferences.find(s => s.idUser === 0)?.currentSprite ?? null,
    }
}


export async function getFullEvolutionChain(pokeNumber: number, idUser: number): Promise<EvolutionStage[]> {
    const orderedGames = await getOrderedGameNames(idUser)

    const pre: number[] = []
    let pn = pokeNumber
    while (true) {
        const p = await prisma.pokemon.findUnique({
            where: { pokeNumber: pn },
            select: { evolutionsTo: { include: { pokemon: { select: { pokeNumber: true } } } } },
        })
        const prev = p?.evolutionsTo[0]?.pokemon?.pokeNumber
        if (!prev) break
        pre.unshift(prev)
        pn = prev
    }

    const post: number[] = []
    const visited = new Set<number>()
    const queue = [pokeNumber]
    while (queue.length) {
        const cur = queue.shift()!
        const p = await prisma.pokemon.findUnique({
            where: { pokeNumber: cur },
            select: { evolutionsFrom: { include: { nextPokemon: { select: { pokeNumber: true } } } } },
        })
        for (const evo of p?.evolutionsFrom ?? []) {
            const next = evo.nextPokemon.pokeNumber
            if (!visited.has(next)) {
                visited.add(next)
                post.push(next)
                queue.push(next)
            }
        }
    }

    const chain = [...pre, pokeNumber, ...post]
    const stages = await Promise.all(chain.map(n => loadStage(n, idUser, orderedGames)))
    return stages.filter((s): s is EvolutionStage => s !== null)
}