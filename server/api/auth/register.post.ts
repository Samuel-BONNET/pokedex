import * as bcrypt from "bcrypt"
import { setCookie } from 'h3'

export default defineEventHandler(async (event) => {

    const body = await readBody(event)

    const {
        pseudo,
        email,
        password,
        passwordConfirmation,
        secretToken
    } = body

    if (!email || !password || !passwordConfirmation || !secretToken || !pseudo) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing credentials',
        })
    }

    if (password !== passwordConfirmation) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Passwords do not match',
        })
    }

    if (secretToken !== process.env.REGISTER_SECRET){
        throw createError({
            statusCode: 400,
            statusMessage: 'SecretToken doesn\'t match',
        })
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    })

    if (existingUser) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Email is already in use',
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            pseudo,
            email,
            password: hashedPassword,
            role: "USER",
            isActive: true,
            preferences: {},
        },
    })

    const token = signToken({ userId: user.id, role: user.role })

    setCookie(event, 'auth_token', token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 3600,
        secure: process.env.NODE_ENV === 'production',
    })

    return { user: { id: user.id, email: user.email, role: user.role } }

})