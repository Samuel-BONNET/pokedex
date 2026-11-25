import { SYSTEM_USER_ID } from '#server/utils/constants.ts'

type IncomingPokemon = { pokeNumber?: unknown; isShiny?: unknown }

export default defineEventHandler(async (event) => {
    const idUser = event.context.user?.userId
    if (!idUser) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })

    const body = (await readBody<{
        version?: unknown
        pokemons?: unknown
        replace?: unknown
    }>(event)) ?? {}

    const version = typeof body.version === 'string' ? body.version.trim() : ''
    if (!version || version.length > 30) throw createError({ statusCode: 400, statusMessage: 'Version manquante ou invalide' })

    const incoming = Array.isArray(body.pokemons) ? body.pokemons as IncomingPokemon[] : []
    if (incoming.length > 2000) throw createError({ statusCode: 413, statusMessage: 'Trop de Pokémon dans la requête' })
    const wanted = new Map<number, boolean>()
    for (const entry of incoming) {
        const pokeNumber = Number(entry?.pokeNumber)
        if (!Number.isInteger(pokeNumber) || pokeNumber <= 0) continue
        wanted.set(pokeNumber, (wanted.get(pokeNumber) ?? false) || Boolean(entry?.isShiny))
    }
    const replace = body.replace !== false

    const pokemonRows = await prisma.pokemon.findMany({
        where: { pokeNumber: { in: [...wanted.keys()] } },
        select: { id: true, pokeNumber: true },
    })
    const idByPokeNumber = new Map(pokemonRows.map(p => [p.pokeNumber, p.id]))

    return prisma.$transaction(async (tx) => {
        const existing = await tx.statut.findMany({
            where: { idUser },
            select: { idPokemon: true, capturedGame: true, isOwned: true, isShiny: true },
        })
        const existingById = new Map(existing.map(s => [s.idPokemon, s]))
        const presentIds = new Set(idByPokeNumber.values())

        const allIds = new Set<number>(presentIds)
        for (const statut of existing) {
            if (Array.isArray(statut.capturedGame) && statut.capturedGame.includes(version)) {
                allIds.add(statut.idPokemon)
            }
        }

        const defaultRows = await tx.statut.findMany({
            where: { idUser: SYSTEM_USER_ID, idPokemon: { in: [...allIds] } },
            select: { idPokemon: true, isOwned: true, isShiny: true },
        })
        const defaults = new Map(defaultRows.map(s => [s.idPokemon, s]))

        let added = 0
        let removed = 0

        if (replace) {
            for (const statut of existing) {
                const captured = Array.isArray(statut.capturedGame) ? statut.capturedGame as string[] : []
                if (!captured.includes(version) || presentIds.has(statut.idPokemon)) continue

                const nextCaptured = captured.filter(v => v !== version)
                const def = defaults.get(statut.idPokemon)
                const sameAsDefault = def && statut.isOwned === def.isOwned && statut.isShiny === def.isShiny

                if (nextCaptured.length === 0 && sameAsDefault) {
                    await tx.statut.delete({
                        where: { idPokemon_idUser: { idPokemon: statut.idPokemon, idUser } },
                    })
                } else {
                    await tx.statut.update({
                        where: { idPokemon_idUser: { idPokemon: statut.idPokemon, idUser } },
                        data: { capturedGame: nextCaptured },
                    })
                }
                removed++
            }
        }

        for (const [pokeNumber, isShiny] of wanted) {
            const idPokemon = idByPokeNumber.get(pokeNumber)
            if (idPokemon === undefined) continue

            const current = existingById.get(idPokemon)
            const captured = Array.isArray(current?.capturedGame) ? current!.capturedGame as string[] : []
            const alreadyThere = captured.includes(version)

            await tx.statut.upsert({
                where: { idPokemon_idUser: { idPokemon, idUser } },
                update: {
                    capturedGame: alreadyThere ? captured : [...captured, version],
                    isOwned: true,
                    isShiny: Boolean(current?.isShiny) || isShiny,
                },
                create: {
                    idPokemon,
                    idUser,
                    capturedGame: [...captured, version],
                    isOwned: true,
                    isShiny,
                },
            })
            if (!alreadyThere) added++
        }

        return { added, removed }
    }, { timeout: 30_000 })
})