import { verifyToken } from '../utils/jwt'

export default defineEventHandler((event) => {
    if (!getRequestURL(event).pathname.startsWith('/api/user')) return

    const header = getHeader(event, 'authorization')

    if (!header) {
        throw createError({ statusCode: 401, statusMessage: 'No token' })
    }

    const parts = header.split(' ')

    if (parts.length !== 2 || !parts[1]) {
        throw createError({ statusCode: 401, statusMessage: 'Malformed token' })
    }

    const token = parts[1]

    try {
        const decoded = verifyToken(token)
        event.context.user = decoded
    } catch {
        throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
    }
})