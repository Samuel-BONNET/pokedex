export default defineEventHandler(async (event) => {
    const idUser = Number(event.context.user?.userId ?? 0)

    return await prisma.statut.findMany({
        where: {
            idUser: idUser,
        }
    })
})