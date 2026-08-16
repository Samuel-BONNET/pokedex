export default defineEventHandler(async (event) => {
    const idGame = Number(getRouterParam(event, 'id'))
    const userId = event.context.user?.userId

    return await prisma.gameSave.delete({
        where: { idGame_idUser: { idGame, idUser: userId }},
    })
})