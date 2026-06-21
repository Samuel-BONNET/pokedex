export default defineEventHandler(async (event) => {
    const idPokemon = Number(getRouterParam(event, 'id'))
    const idUser = (event.context.user as { userId?: number })?.userId ?? 0

    return await prisma.statut.findFirst({
        where: {
            idPokemon,
            idUser: { in: [idUser, 0] }
        },
        orderBy: {
            idUser: 'desc'
        },
        select: {
            currentSprite: true
        }
    })
})