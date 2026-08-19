export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))
    return await prisma.game.findUnique({ where: { id } })
})
