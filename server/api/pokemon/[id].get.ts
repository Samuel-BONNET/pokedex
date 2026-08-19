export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))
    const idUser = Number(getQuery(event).userId ?? 0)

    const pokemon = await prisma.pokemon.findUnique({
        where: { pokeNumber: id },
        include: {
            statuts: {
                where: { idUser: { in: [idUser, 0] } },
                select: { currentSprite: true, idUser: true },
            },
        },
    })

    if (!pokemon) return null

    return {
        ...pokemon,
        currentSprite: pokemon.statuts.find(s => s.idUser === idUser)?.currentSprite ?? pokemon.statuts.find(s => s.idUser === 0)?.currentSprite ?? null,
        statuts: undefined,
    }
})