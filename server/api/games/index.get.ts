import {SYSTEM_USER_ID} from "#server/utils/constants.ts";
import { getCoversByBase } from "../../utils/gameCovers"

export default defineEventHandler(async (event) => {
    const idUser = Number(event.context.user?.userId ?? SYSTEM_USER_ID)

    const games = await prisma.game.findMany({
        orderBy: { id: 'asc' },
        include: {
            gamePreferences: {
                where: { idUser: { in: [idUser, SYSTEM_USER_ID] } },
                select: { idUser: true, currentSprite: true }
            },
        },
    })

    const coversByBase = getCoversByBase()

    return games.map(g => ({
        ...g,
        currentSprite: g.gamePreferences.find(s => s.idUser === idUser)?.currentSprite ?? g.gamePreferences.find(s => s.idUser === SYSTEM_USER_ID)?.currentSprite ?? null,
        gamePreferences: undefined,
        availableJaquettes: coversByBase.get(g.nameEn) ?? [],
    }))
})