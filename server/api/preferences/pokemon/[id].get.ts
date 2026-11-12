import {SYSTEM_USER_ID} from "#server/utils/constants.ts";

export default defineEventHandler(async(event) => {
    const idPokemon = Number(getRouterParam(event, 'id'))
    const idUser = Number(getQuery(event).userId ?? SYSTEM_USER_ID)

    return prisma.pokemonPreferences.findUnique({
        where: {
            idPokemon_idUser:{
                idPokemon,
                idUser
            }
        }
    })
})