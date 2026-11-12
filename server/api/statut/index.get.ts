import {SYSTEM_USER_ID} from "#server/utils/constants.ts";

export default defineEventHandler(async (event) => {
    const idUser = Number(event.context.user?.userId ?? SYSTEM_USER_ID)

    return await prisma.statut.findMany({
        where: {
            idUser: idUser,
        }
    })
})