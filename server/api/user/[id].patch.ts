import { requireAdmin } from '../../utils/auth'
import { SYSTEM_USER_ID, GUEST_USER_ID } from '../../utils/constants'

export default defineEventHandler(async (event) => {
    const admin = requireAdmin(event)
    const id = Number(getRouterParam(event, 'id'))
    const body = await readBody<{ isActive?: unknown }>(event)

    if (!Number.isInteger(id) || id <= 0) {
        throw createError({ statusCode: 400, statusMessage: 'Identifiant invalide' })
    }
    if (typeof body?.isActive !== 'boolean') {
        throw createError({ statusCode: 400, statusMessage: 'isActive doit être un booléen' })
    }
    if (id === admin.userId || id === SYSTEM_USER_ID || id === GUEST_USER_ID) {
        throw createError({ statusCode: 403, statusMessage: 'Compte protégé' })
    }

    const existing = await prisma.user.findUnique({
        where: { id },
        select: { id: true },
    })
    if (!existing) {
        throw createError({ statusCode: 404, statusMessage: 'Utilisateur introuvable' })
    }

    return await prisma.user.update({
        where: { id },
        data: { isActive: body.isActive },
        select: { id: true, pseudo: true, role: true, isActive: true },
    })
})
