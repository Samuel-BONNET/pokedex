export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))
    const idUser = Number(getQuery(event).userId ?? 1)

    const orderedNames = await getOrderedGameNames(idUser)

    const pokemon = await prisma.pokemon.findUnique({
        where: { pokeNumber: id },
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

    if (!pokemon) return null

    return {
        ...pokemon,
        isOwned: pokemon.statuts.find(s => s.idUser === idUser)?.isOwned ?? false,
        isShiny: pokemon.statuts.find(s => s.idUser === idUser)?.isShiny ?? false,
        currentSprite: pokemon.pokemonPreferences.find(s => s.idUser === idUser)?.currentSprite ?? pokemon.pokemonPreferences.find(s => s.idUser === 0)?.currentSprite ?? null,
        statuts: undefined,
    }
})