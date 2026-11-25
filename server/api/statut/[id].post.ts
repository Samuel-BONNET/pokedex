import {SYSTEM_USER_ID} from "#server/utils/constants.ts";

export default defineEventHandler(async (event) => {
    const pokeNumber = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)
    const idUser = event.context.user?.userId
    if (!idUser) return

    const pokemon = await prisma.pokemon.findUnique({
        where: { pokeNumber },
        select: { id: true },
    })
    if (!pokemon) throw createError({ statusCode: 404, statusMessage: 'Pokémon introuvable' })

    const idPokemon = pokemon.id
    const isOwned = body.isOwned
    const isShiny = body.isShiny
    const captured= Array.isArray(body.capturedGame) ? body.capturedGame as string[] : undefined

    const updateData = {
        ...(isOwned !== undefined && { isOwned }),
        ...(isShiny !== undefined && { isShiny }),
        ...(captured !== undefined && { captured }),
        ...(captured !== undefined && isOwned === undefined && captured.length > 0 && { isOwned: true }),
    }

    const createData = {
        idPokemon,
        idUser,
        isOwned: isOwned ?? (captured?.length ?? 0) > 0,
        isShiny: isShiny ?? false,
        capturedGame: captured ?? [],
    }

    const defaultStatut = await prisma.statut.findUnique({
        where: { idPokemon_idUser: { idPokemon, idUser: SYSTEM_USER_ID} }
    })

    const result = await prisma.statut.upsert({
        where: {
            idPokemon_idUser: {
                idPokemon,
                idUser,
            }
        },
        update: {
            idPokemon,
            idUser,
            isOwned: updateData.isOwned,
            isShiny: updateData.isShiny,
            capturedGame: updateData.captured,
        },
        create: {
            idPokemon,
            idUser,
            capturedGame: createData.capturedGame,
            isOwned: createData.isOwned,
            isShiny: createData.isShiny,
        },
    })

    const capturedResult = Array.isArray(result.capturedGame) ? result.capturedGame: []
    if (defaultStatut && result.isOwned === defaultStatut.isOwned && defaultStatut.isShiny === result.isShiny && capturedResult.length === 0) {
        await prisma.statut.delete({
            where: { idPokemon_idUser: { idPokemon, idUser} }
        })
        return { deleted: true }
    }

    return result
})