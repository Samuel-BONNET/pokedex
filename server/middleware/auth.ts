import { defineEventHandler, getRequestURL, getCookie, getHeader, deleteCookie, createError } from 'h3'
import { verifyToken } from '../utils/jwt'
import { prisma } from '../utils/prisma'

const PUBLIC_PREFIXES = ['/api/auth', '/api/pokemon', '/api/types', '/api/changelog', '/api/test']

export default defineEventHandler(async (event) => {
    const pathname = getRequestURL(event).pathname
    if (!pathname.startsWith('/api')) return

    let token = getCookie(event, 'auth_token')

    if (!token) {
        const authHeader = getHeader(event, 'authorization')
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7)
        }
    }
    if (token) {
        try {
            const payload = verifyToken(token)
            if (payload && typeof payload === 'object' && Number.isInteger(Number(payload.userId))) {
                const account = await prisma.user.findUnique({
                    where: { id: Number(payload.userId) },
                    select: { isActive: true, role: true },
                })
                if (!account?.isActive) throw createError({ statusCode: 403, statusMessage: 'Account disabled' })
                event.context.user = { userId: Number(payload.userId), role: account.role }
            }
        } catch {
            deleteCookie(event, 'auth_token', { path: '/' })
            event.context.user = undefined
        }
    }

    const isPublic = PUBLIC_PREFIXES.some(p => pathname.startsWith(p))
    if (!isPublic && !event.context.user) {
        throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
    }
})
