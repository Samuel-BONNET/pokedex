export default defineEventHandler(async (event) => {
    const idGame = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)
    const idUser = body.idUser ?? 0
    if (idUser === 0 || !body.currentSprite) return

    const result = await prisma.gamePreferences.upsert({
        where: { idGame_idUser: { idGame, idUser } },
        update: { currentSprite: body.currentSprite },
        create: { idGame, idUser, currentSprite: body.currentSprite}
    })

    const defaultPrefs = await prisma.gamePreferences.findUnique({
        where: { idGame_idUser: { idGame, idUser: 0 } }
    })

    if (defaultPrefs && result.currentSprite === defaultPrefs.currentSprite) {
        await prisma.gamePreferences.delete({
            where: { idGame_idUser: { idGame, idUser } }
        })
        return { deleted: true }
    }
    return result
})