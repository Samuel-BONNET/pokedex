import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    requireAdmin(event)

    return await prisma.user.findMany({
        select: {
            id: true,
            pseudo: true,
            role: true,
            isActive: true,
            createdAt: true,
        },
        orderBy: { id: 'asc' },
    })
})
