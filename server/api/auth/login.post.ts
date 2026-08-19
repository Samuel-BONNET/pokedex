import * as bcrypt from 'bcrypt'
import { signToken } from '../../utils/jwt'
import { prisma } from '../../utils/prisma'
import { setCookie } from 'h3'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const { email, password } = body

    if (!email || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing credentials',
        })
    }

    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid credentials',
        })
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid credentials',
        })
    }

    const token = signToken({
        userId: user.id,
        role: user.role,
    })

    setCookie(event, 'auth_token', token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 3600,
        secure: process.env.NODE_ENV === 'production',
    })

    return { user: { id: user.id, email: user.email, role: user.role } }

})