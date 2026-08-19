export default defineEventHandler(async (event) => {
    const body = await readBody<{ statuts: Array<{
        idPokemon: number,
        idUser: number,
        isOwned: boolean,
        isShiny: boolean,
        currentSprite: string,
        idGameProvenance: number,
    }> }>(event)

    let count = 0
    for (const statut of body.statuts) {
        await prisma.statut.upsert({
            where: {
                idPokemon_idUser: {
                    idPokemon: statut.idPokemon,
                    idUser: statut.idUser,
                }
            },
            update: {
                isOwned: statut.isOwned,
                isShiny: statut.isShiny,
                currentSprite: statut.currentSprite,
                idGameProvenance: statut.idGameProvenance,
            },
            create: {
                idPokemon: statut.idPokemon,
                idUser: statut.idUser,
                isOwned: statut.isOwned,
                isShiny: statut.isShiny,
                currentSprite: statut.currentSprite,
                idGameProvenance: statut.idGameProvenance,
            }
        })
        count++
    }

    return { count }
})
