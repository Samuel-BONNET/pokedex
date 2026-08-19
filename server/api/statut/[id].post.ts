export default defineEventHandler(async (event) => {
    const idPokemon = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)
    const idUser = body.idUser ?? 1
    if (idUser === 0) return
    const currentSprite = body.currentSprite
    const gameName = body.gameName
    const isOwned = body.isOwned
    const isShiny = body.isShiny

    const defaultStatut = await prisma.statut.findUnique({
        where: { idPokemon_idUser: { idPokemon, idUser: 0} }
    })

    const game = gameName ? await prisma.game.findUnique({ where: { nameEn: gameName } }): null
    const idGameProvenance = game?.id ?? 1

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
            currentSprite,
            idGameProvenance,
            isOwned,
            isShiny,
        },
        create: {
            idPokemon,
            idUser,
            currentSprite: currentSprite ?? null,
            idGameProvenance,
            isOwned: isOwned ?? false,
            isShiny: isShiny ?? false,
        },
    })

    if (defaultStatut && defaultStatut.currentSprite !== null && result.isOwned === defaultStatut.isOwned && defaultStatut.isShiny === result.isShiny) {
        await prisma.statut.delete({
            where: { idPokemon_idUser: { idPokemon, idUser}}
        })
        return { deleted: true }
    }

    return result
})