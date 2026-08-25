export default defineEventHandler(async (event) => {
    const idUser = Number(getQuery(event).userId ?? 0)

    const statuts = await prisma.statut.findMany({
        where: { idUser },
    })

    const headers = ['idPokemon', 'idUser', 'isOwned', 'isShiny']
    const csvRows = [
        headers.join(','),
        ...statuts.map(s => [s.idPokemon, s.idUser, s.isOwned, s.isShiny].join(','))
    ]

    setHeader(event, 'Content-Type', 'text/csv')
    setHeader(event, 'Content-Disposition', `attachment; filename="pokedex-${idUser}.csv"`)
    return csvRows.join('\n')
})
