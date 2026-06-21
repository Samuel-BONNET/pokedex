import { defineEventHandler, getRequestURL, createError, getCookie } from 'h3'
import { verifyToken } from '../utils/jwt'

export default defineEventHandler((event) => {
    const pathname = getRequestURL(event).pathname

    if (!pathname.startsWith('/api/user') && !pathname.startsWith('/api/statut')) return

    const token = getCookie(event, 'auth_token')

    if (!token) {
        if (pathname.startsWith('/api/user')) {
            throw createError({ statusCode: 401, statusMessage: 'No token' })
        }
        return
    }

    try {
        const decoded = verifyToken(token)
        event.context.user = decoded
    } catch {
        if (pathname.startsWith('/api/user')) {
            throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
        }
    }
})