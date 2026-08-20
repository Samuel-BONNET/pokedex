export default defineEventHandler(async(event) => {
    const idPokemon = Number(getRouterParam(event, 'id'))
    const idUser = Number(getQuery(event).userId ?? 0)

    return prisma.pokemonPreferences.findUnique({
        where: {
            idPokemon_idUser:{
                idPokemon,
                idUser
            }
        }
    })
})