import { signToken } from '../../utils/jwt'
import { prisma } from '../../utils/prisma'
import { setCookie } from 'h3'
import {GUEST_USER_ID} from "#server/utils/constants.ts";

export default defineEventHandler(async (event) => {
    const guest = await prisma.user.findUnique({ where: { id: GUEST_USER_ID } })
    if (!guest || guest.role !== 'GUEST') {
        throw createError({ statusCode: 500, statusMessage: 'Guest account missing' })
    }
    const token = signToken({ userId: guest.id, role: guest.role })
    setCookie(event, 'auth_token', token, {
        httpOnly: true, sameSite: 'lax', path: '/', maxAge: 3600,
        secure: process.env.NODE_ENV === 'production',
    })
    return { user: { id: guest.id, role: guest.role } }
})