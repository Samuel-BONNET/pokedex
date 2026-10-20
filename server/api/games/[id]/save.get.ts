import { getTwinGroupKey } from '~/utils/gameVersions'

export default defineEventHandler(async (event) => {
    const idGame = Number(getRouterParam(event, 'id'))
    const userId = event.context.user?.userId ?? 0

    const query = getQuery(event)
    const version = (query.version as string | undefined)?.trim() || 'default'

    const tryVersions = [...new Set([version, getTwinGroupKey(version)].filter(Boolean))]

    for (const v of tryVersions) {
        try {
            const save = await prisma.gameSave.findUnique({
                where: { idGame_idUser_version: { idGame, idUser: userId, version: v } },
            })
            if (save) {
                setHeader(event, 'Content-Type', 'application/octet-stream')
                setHeader(event, 'Content-Disposition', `attachment; filename="${save.fileName}"`)
                return Buffer.from(save.file)
            }
        } catch (e) {
            // essaie la clé suivante
        }
    }

    try {
        const save = await prisma.gameSave.findUnique({
            where: { idGame_idUser: { idGame, idUser: userId } as any },
        })
        if (save) {
            setHeader(event, 'Content-Type', 'application/octet-stream')
            setHeader(event, 'Content-Disposition', `attachment; filename="${save.fileName}"`)
            return Buffer.from(save.file)
        }
    } catch (e) {
        // aucune sauvegarde
    }

    throw createError({ statusCode: 404, statusMessage: 'Aucune sauvegarde' })
})
