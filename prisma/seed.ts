import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as bcrypt from 'bcrypt'

const adapter = new PrismaPg(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10)

    await prisma.user.upsert({
        where: {
            id: 0
        },
        update: {},
        create: {
            id: 0,
            email: "system@local.fr",
            password: "",
            role: "SYS",
            pseudo: "System",
            preferences: {},
        }
    })

    await prisma.user.upsert({
        where: {
            id: 1
        },
        update: {},
        create: {
            id: 1,
            email: "",
            password: "",
            role: "GUEST",
            pseudo: "Guest",
            preferences: {},
        }
    })

    await prisma.user.upsert({
        where: {
            id: 2
        },
        update: {},
        create: {
            email: 'admin@site.com',
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