export default defineEventHandler(async (event) => {
    const idUser = Number(getQuery(event).userId ?? 0)

    const orderedName = await getOrderedGameNames(idUser)

    const pokemon = await prisma.pokemon.findMany({
        orderBy: { pokeNumber: 'asc' },
        include: {
            statuts: {
                where: { idUser: { in: [idUser, 0] } },
                select: { idUser: true, isOwned: true, isShiny: true },
            },
            pokemonPreferences: {
                where: { idUser: { in: [idUser, 0] } },
                select: { idUser: true, currentSprite: true }
            },
        },
    })
    return pokemon.map(p => ({
        ...p,
        isOwned: p.statuts.find(s => s.idUser === idUser)?.isOwned ?? false,
        isShiny: p.statuts.find(s => s.idUser === idUser)?.isShiny ?? false,
        currentSprite: p.pokemonPreferences.find(s => s.idUser === idUser)?.currentSprite ?? findSpriteByOrder(p.availableGames, orderedName) ?? p.pokemonPreferences.find(s => s.idUser === 0)?.currentSprite ?? null,
        statuts: undefined,
    }))
})