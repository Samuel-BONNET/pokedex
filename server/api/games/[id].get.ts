import { existsSync, readdirSync } from "node:fs"
import { join } from "node:path"

const JQ_DIR = join(process.cwd(), 'public', 'img', 'games', 'fr')

export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))
    const idUser = Number(getQuery(event).userId ?? 0)

    const game = await prisma.game.findUnique({
        where: { id },
        include: {
            gamePreferences: {
                where: { idUser: { in: [idUser, 0 ] } },
                select: { idUser: true, currentSprite: true }
            },
        },
    })

    if (!game) return null

    const allFiles = readdirSync(JQ_DIR)
    const availableJaquettes = allFiles.filter(f => f.startsWith(game.nameEn) && f.endsWith('.png')).map(f => ({
        name: f.replace('.png', ''),
        sprite: `/img/games/fr/${f}`
        }))

    return {
        ...game,
        currentSprite: game.gamePreferences.find(s => s.idUser === idUser)?.currentSprite ?? game.gamePreferences.find(s => s.idUser === 0)?.currentSprite ?? null,
        gamePreferences: undefined,
        availableJaquettes,
    }
})
