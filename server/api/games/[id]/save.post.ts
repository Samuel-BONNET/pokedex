export default defineEventHandler(async (event) => {
    const idGame = Number(getRouterParam(event, 'id'))
    const userId = event.context.user?.userId

    const form = await readMultipartFormData(event)
    const filePart = form?.find(p => p.name === 'file')
    if (!filePart?.data) throw createError({ statusCode: 400, statusMessage: 'Fichier manquant' })

    let version = 'default'
    const versionPart = form?.find(p => p.name === 'version')
    if (versionPart?.data) {
        const v = Buffer.from(versionPart.data).toString('utf8').trim()
        if (v) version = v
    }
    if (version === 'default') {
        const query = getQuery(event)
        const vq = (query.version as string | undefined)?.trim()
        if (vq) version = vq
    }

    const fileName = filePart.filename ?? 'save.sav'
    const fileData = Uint8Array.from(filePart.data)

    try {
        return await prisma.gameSave.upsert({
            where: { idGame_idUser_version: { idGame, idUser: userId, version } },
            update: { file: fileData, fileName, size: filePart.data.length },
            create: { idGame, idUser: userId, version, file: fileData, fileName, size: filePart.data.length },
        })
    } catch (e) {
        return await prisma.gameSave.upsert({
            where: { idGame_idUser_version: { idGame, idUser: userId } as any },
            update: { file: fileData, fileName, size: filePart.data.length },
            create: { idGame, idUser: userId, version, file: fileData, fileName, size: filePart.data.length },
        })
    }
})
