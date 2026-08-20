export default defineEventHandler(async (event) => {
    const idUser = Number(getQuery(event).userId ?? 0)

    const games = await prisma.game.findMany({
        orderBy: { id: 'asc' },
        include: {
            gamePreferences: {
                where: { idUser: { in: [idUser, 0] } },
                select: { idUser: true, currentSprite: true }
            },
        },
    })

    return games.map(g => ({
        ...g,
        currentSprite: g.gamePreferences.find(s => s.idUser === idUser)?.currentSprite ?? g.gamePreferences.find(s => s.idUser === 0)?.currentSprite ?? null,
        gamePreferences: undefined,
    }))
})