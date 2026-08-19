export default defineEventHandler(async (event) => {
    const idPokemon = Number(getRouterParam(event, 'id'))
    const idUser = Number(getQuery(event).userId ?? 0)

    return prisma.statut.findFirst({
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