import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Kreiranje test korisnika
  const hashedPassword = await bcrypt.hash('test123', 12)

  await prisma.user.createMany({
    data: [
      {
        email: 'nastavnik@test.com',
        password: hashedPassword,
        name: 'Ana Marić',
        role: 'NASTAVNIK'
      },
      {
        email: 'roditelj@test.com',
        password: hashedPassword,
        name: 'Marko Petrović',
        role: 'RODITELJ'
      },
      {
        email: 'ucenik@test.com',
        password: hashedPassword,
        name: 'Petra Nikolić',
        role: 'UCENIK'
      }
    ]
  })

  console.log('Test korisnici kreirani!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })