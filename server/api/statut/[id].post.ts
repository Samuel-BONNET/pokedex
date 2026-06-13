export default defineEventHandler(async (event) => {
    const idPokemon = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)
    const idUser = body.idUser ?? 1
    if (idUser === 0) return
    const currentSprite = body.currentSprite
    const gameName = body.gameName

    const game = gameName ? await prisma.game.findUnique({ where: { nameEn: gameName } }): null
    const idGameProvenance = game?.id ?? 1

    return await prisma.statut.upsert({
        where: {
            idPokemon_idUser: {
                idPokemon,
                idUser,
            }
        },
        update: {
            currentSprite,
            idGameProvenance,
        },
        create: {
            idPokemon,
            idUser,
            currentSprite,
            idGameProvenance,
            isOwned: false,
            isShiny: false,
        },
    })
})