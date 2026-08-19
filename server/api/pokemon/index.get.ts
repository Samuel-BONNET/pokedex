export default defineEventHandler(async (event) => {
    const idUser = Number(getQuery(event).userId ?? 0)

    const pokemons = await prisma.pokemon.findMany({
        orderBy: { pokeNumber: 'asc' },
        include: {
            statuts: {
                where: { idUser: { in: [idUser, 0] } },
                select: { currentSprite: true, idUser: true },
            },
        },
    })
    return pokemons.map(p => ({
        ...p,
        currentSprite: p.statuts.find(s => s.idUser === idUser)?.currentSprite ?? p.statuts.find(s => s.idUser === 0)?.currentSprite ?? null,
        statuts: undefined,
    }))
})