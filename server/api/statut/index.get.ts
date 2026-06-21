export default defineEventHandler(async (event) => {
    const idUser = Number(getQuery(event).userId ?? 0)

    return await prisma.statut.findMany({
        where: {
            idUser: idUser,
        }
    })
})