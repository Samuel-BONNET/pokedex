import { SYSTEM_USER_ID } from '#server/utils/constants.ts'

export default defineEventHandler(async (event) => {
    const pokeNumber = Number(getRouterParam(event, 'id'))
    const idUser = Number(getQuery(event).userId ?? SYSTEM_USER_ID)

    const pokemon = await prisma.pokemon.findUnique({
        where: { pokeNumber },
        select: { id: true },
    })
    if (!pokemon) return null

    return prisma.statut.findFirst({
        where: {
            idPokemon: pokemon.id,
            idUser: { in: [idUser, SYSTEM_USER_ID] }
        },
        orderBy: {
            idUser: 'desc'
        }
    })
})
