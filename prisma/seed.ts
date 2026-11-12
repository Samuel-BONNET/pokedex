import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import * as bcrypt from 'bcrypt'

const dbUrl = new URL(process.env.DATABASE_URL!)

const adapter = new PrismaMariaDb({
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port || '3306'),
    user: dbUrl.username,
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.replace('/', ''),
    connectionLimit: 5,
})
const prisma = new PrismaClient({ adapter })

async function main() {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10)

    await prisma.user.upsert({
        where: {
            id: 1
        },
        update: {},
        create: {
            id: 1,
            email: "system@local.fr",
            password: "",
            role: "SYS",
            pseudo: "System",
            preferences: {},
        }
    })

    await prisma.user.upsert({
        where: {
            id: 2
        },
        update: {},
        create: {
            id: 2,
            email: "",
            password: "",
            role: "GUEST",
            pseudo: "Guest",
            preferences: {},
        }
    })

    await prisma.user.upsert({
        where: {
            id: 3
        },
        update: {},
        create: {
            id: 3,
            email: process.env.ADMIN_EMAIL!,
            password: hashedPassword,
            role: 'ADMIN',
            pseudo: 'admin',
            preferences: {},
        },
    })

}

main()
    .finally(async () => {
        await prisma.$disconnect()
    })
