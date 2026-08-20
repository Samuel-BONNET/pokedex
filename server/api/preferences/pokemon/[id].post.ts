export default defineEventHandler(async (event) => {
    const idPokemon = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)
    const idUser = body.idUser ?? 1
    if (idUser === 0) return

    const result = await prisma.pokemonPreferences.upsert({
        where: { idPokemon_idUser: { idPokemon, idUser } },
        update: { currentSprite: body.currentSprite },
        create: { idPokemon, idUser, currentSprite: body.currentSprite },
    })

    const defaultPrefs = await prisma.pokemonPreferences.findUnique({
        where: {idPokemon_idUser: {idPokemon, idUser: 0}}
    })

    if (defaultPrefs && result.currentSprite === defaultPrefs.currentSprite) {
        await prisma.pokemonPreferences.delete({
            where: { idPokemon_idUser: { idPokemon, idUser } }
        })
        return { deleted: true }
    }
    return result
})