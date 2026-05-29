import * as bcrypt from 'bcrypt'
import { signToken } from '../../utils/jwt'
import { prisma } from '../../utils/prisma'

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

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
    }
})