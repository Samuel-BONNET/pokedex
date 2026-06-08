import bcrypt from "bcryptjs"

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

    if (secretToken !== process.env.JWT_SECRET){
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

    await prisma.user.create({
        data: {
            pseudo,
            email,
            password: hashedPassword,
            role: "USER",
            isActive: true,
            preferences: {},
        },
    })

    return {
        success: true,
    }
})