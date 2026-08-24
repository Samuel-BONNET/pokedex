export default defineEventHandler(async(event) => {
    const idUser = Number(getQuery(event).userId ?? 0)

    if (idUser === 0) return { gameOrder: [] }

    const user = await prisma.user.findUnique({
        where: { id: idUser },
        select: { preferences: true },
    })

    return { gameOrder: (user?.preferences as Record<string, number[]>)?.gameOrder ?? [] }
})