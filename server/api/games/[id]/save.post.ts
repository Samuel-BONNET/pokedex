export default defineEventHandler(async (event) => {
    const idGame = Number(getRouterParam(event, 'id'))
    const userId = event.context.user?.userId

    const form = await readMultipartFormData(event)
    const filePart = form?.find(p => p.name === 'file')
    if (!filePart?.data) throw createError({ statusCode: 400, statusMessage: 'Fichier manquant' })

    const fileName = filePart.filename ?? 'save.sav'

    const fileData = Uint8Array.from(filePart.data)

    return await prisma.gameSave.upsert({
        where: { idGame_idUser: { idGame, idUser: userId }},
        update: { file: fileData, fileName, size: filePart.data.length},
        create: { idGame, idUser: userId, file: fileData, fileName, size: filePart.data.length },
    })
})