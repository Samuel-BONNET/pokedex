import { readdirSync } from "node:fs"
import { join } from "node:path"

const JQ_DIR = join(process.cwd(), 'public', 'img', 'games', 'fr')

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

    const allFiles = readdirSync(JQ_DIR)

    return games.map(g => ({
        ...g,
        currentSprite: g.gamePreferences.find(s => s.idUser === idUser)?.currentSprite ?? g.gamePreferences.find(s => s.idUser === 0)?.currentSprite ?? null,
        gamePreferences: undefined,
        availableJaquettes: allFiles.filter(f => f.startsWith(g.nameEn) && f.endsWith('.png')).map(f => ({
            name: f.replace('.png', ''),
            sprite: `/img/games/fr/${f}`,
        })),
    }))
})