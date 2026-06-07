export default defineEventHandler(async () => {
    return await prisma.game.findMany({
        orderBy: {
            id: 'asc',
        }
    })
})