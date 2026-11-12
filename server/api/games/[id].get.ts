import { existsSync, readdirSync } from "node:fs"
import { coversDir, coverPath } from "../../utils/lang"
import {SYSTEM_USER_ID} from "#server/utils/constants.ts";

const JQ_DIR = coversDir()

export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))
    const idUser = Number(getQuery(event).userId ?? SYSTEM_USER_ID)

    const game = await prisma.game.findUnique({
        where: { id },
        include: {
            gamePreferences: {
                where: { idUser: { in: [idUser, SYSTEM_USER_ID] } },
                select: { idUser: true, currentSprite: true }
            },
        },
    })

    if (!game) return null

    const allFiles = readdirSync(JQ_DIR)
    const availableJaquettes = allFiles.filter(f => f.startsWith(game.nameEn) && f.endsWith('.png')).map(f => ({
        name: f.replace('.png', ''),
        sprite: coverPath(f)
        }))

    return {
        ...game,
        total: await prisma.game.count(),
        currentSprite: game.gamePreferences.find(s => s.idUser === idUser)?.currentSprite ?? game.gamePreferences.find(s => s.idUser === SYSTEM_USER_ID)?.currentSprite ?? null,
        gamePreferences: undefined,
        availableJaquettes,
    }
})
