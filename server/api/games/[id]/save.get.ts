export default defineEventHandler(async (event) => {
    const idGame = Number(getRouterParam(event, 'id'))
    const userId = event.context.user?.userId

    const save = await prisma.gameSave.findUnique({
        where: { idGame_idUser: { idGame, idUser: userId } },
    })
    if (!save) throw createError({ statusCode: 404, statusMessage: 'Aucune sauvegarde' })

    setHeader(event, 'Content-Type', 'application/octet-stream')
    setHeader(event, 'Content-Disposition', `attachment; filename="${save.fileName}"`)
    return Buffer.from(save.file)
})
