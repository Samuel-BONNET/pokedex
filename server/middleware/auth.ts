import { defineEventHandler, getHeader, getRequestURL, createError } from 'h3'
import { verifyToken } from '../utils/jwt'

export default defineEventHandler((event) => {
    const pathname = getRequestURL(event).pathname

    if (!pathname.startsWith('/api/user') && !pathname.startsWith('/api/statut')) return

    const header = getHeader(event, 'authorization')

    if (!header) {
        throw createError({ statusCode: 401, statusMessage: 'No token' })
    }

    const parts = header.split(' ')

    if (parts.length !== 2) {
        throw createError({ statusCode: 401, statusMessage: 'Malformed token' })
    }

    const token = parts[1]!

    try {
        const decoded = verifyToken(token)
        event.context.user = decoded
    } catch {
        throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
    }
})