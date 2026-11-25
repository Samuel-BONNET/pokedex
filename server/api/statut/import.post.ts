import { requireUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const idUser = requireUser(event)
    const body = await readBody<{ statuts: Array<{
        idPokemon: number,
        isOwned: boolean,
        isShiny: boolean,
    }> }>(event)

    let count = 0
    for (const statut of body.statuts) {
        await prisma.statut.upsert({
            where: {
                idPokemon_idUser: {
                    idPokemon: statut.idPokemon,
                    idUser,
                }
            },
            update: {
                isOwned: statut.isOwned,
                isShiny: statut.isShiny,
            },
            create: {
                idPokemon: statut.idPokemon,
                idUser,
                isOwned: statut.isOwned,
                isShiny: statut.isShiny,
            }
        })
        count++
    }

    return { count }
})
