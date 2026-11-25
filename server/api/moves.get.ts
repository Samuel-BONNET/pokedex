export default defineEventHandler(() =>
    prisma.move.findMany({
        orderBy: { nameFr: 'asc' },
        select: { id: true, nameEn: true, nameFr: true, type: true },
    })
)
