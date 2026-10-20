export default defineEventHandler(async (event) => {
    const idGame = Number(getRouterParam(event, 'id'))
    const userId = event.context.user?.userId

    const query = getQuery(event)
    const version = (query.version as string | undefined)?.trim() || 'default'

    try {
        return await prisma.gameSave.delete({
            where: { idGame_idUser_version: { idGame, idUser: userId, version } },
        })
    } catch (e) {
        return await prisma.gameSave.delete({
            where: { idGame_idUser: { idGame, idUser: userId } as any },
        })
    }
})
