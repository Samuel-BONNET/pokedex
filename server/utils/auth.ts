import { createError, type H3Event } from 'h3'

export function requireAdmin(event: H3Event) {
    const user = event.context.user

    if (!user || user.role !== 'ADMIN') {
        throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
    }

    return user as { userId: number, role: string }
}

export function requireUser(event: H3Event) {
    const user = event.context.user

    if (!user || !Number.isInteger(Number(user.userId))) {
        throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
    }

    return Number(user.userId)
}
