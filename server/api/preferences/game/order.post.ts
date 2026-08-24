export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const idUser = body.idUser ?? 0
    const order: number[] = Array.isArray(body.order) ? body.order.map(Number): []

    if ( idUser === 0 || !order.length ) return

    const validGames = await prisma.game.findMany({
        where: { id: { in: order } },
        select: { id: true },
    })

    const validIds = new Set(validGames.map(g => g.id))
    if (order.some(id => !validIds.has(id))) {
        throw createError({ statusCode: 400, statusMessage: 'Ordre invalide' })
    }

    const user = await prisma.user.findUnique({
        where: { id: idUser },
        select: { preferences: true },
    })

    if (!user) throw createError({ statusCode: 400, statusMessage: 'Utilisateur introuvable' })

    await prisma.user.update({
        where: { id: idUser },
        data: { preferences: { ...(user.preferences as object), gameOrder: order } },
    })

    return { ok: true }
})