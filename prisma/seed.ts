import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as bcrypt from 'bcrypt'

const adapter = new PrismaPg(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10)

    await prisma.user.upsert({
        where: { email: 'admin@site.com' },
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