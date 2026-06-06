export default defineEventHandler(async () => {
    return await prisma.pokemon.findMany({
        orderBy: {
            pokeNumber: 'asc',
        }
    })
})