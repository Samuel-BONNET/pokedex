export default defineEventHandler(async (event) => {
    const idPokemon = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)
    const idUser = body.idUser ?? 1
    if (idUser === 0) return
    const isOwned = body.isOwned
    const isShiny = body.isShiny

    const defaultStatut = await prisma.statut.findUnique({
        where: { idPokemon_idUser: { idPokemon, idUser: 0} }
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
            isOwned,
            isShiny,
        },
        create: {
            idPokemon,
            idUser,
            isOwned: isOwned ?? false,
            isShiny: isShiny ?? false,
        },
    })

    if (defaultStatut && result.isOwned === defaultStatut.isOwned && defaultStatut.isShiny === result.isShiny) {
        await prisma.statut.delete({
            where: { idPokemon_idUser: { idPokemon, idUser} }
        })
        return { deleted: true }
    }

    return result
})