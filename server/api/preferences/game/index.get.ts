import {SYSTEM_USER_ID} from "#server/utils/constants.ts";

export default defineEventHandler(async (event) => {
    const idUser = Number(getQuery(event).userId ?? SYSTEM_USER_ID)

    const user = await prisma.user.findUnique({
        where: { id: idUser },
        select: { preferences: true },
    })

    const prefs = (user?.preferences ?? {}) as Record<string, unknown>

    return {
        isEmpty: Object.keys(prefs).length === 0,
        gameOrder: Array.isArray(prefs.gameOrder) ? prefs.gameOrder : [],
        gameTierSizes: Array.isArray(prefs.gameTierSizes) ? prefs.gameTierSizes : [],
    }
})