import { defineEventHandler, getRequestURL, getCookie, deleteCookie, createError } from 'h3'
import { verifyToken } from '../utils/jwt'

const PUBLIC_PREFIXES = ['/api/auth', '/api/pokemon', '/api/types', '/api/changelog', '/api/test']

export default defineEventHandler((event) => {
    const pathname = getRequestURL(event).pathname
    if (!pathname.startsWith('/api')) return

    const token = getCookie(event, 'auth_token')
    if (token) {
        try {
            event.context.user = verifyToken(token)
        } catch {
            deleteCookie(event, 'auth_token', { path: '/' })
        }
    }

    const isPublic = PUBLIC_PREFIXES.some(p => pathname.startsWith(p))
    if (!isPublic && !event.context.user) {
        throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
    }
})