const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  // Criar coaches ADMIN iniciais
  const hashedPassword = await bcrypt.hash("123456", 10)

  const gabriel = await prisma.user.upsert({
    where: { email: "gabriel@4kteam.com" },
    update: {},
    create: {
      email: "gabriel@4kteam.com",
      password: hashedPassword,
      name: "Gabriel",
      role: "ADMIN",
      userType: "COACH",
    },
  })

  const ingrid = await prisma.user.upsert({
    where: { email: "ingrid@4kteam.com" },
    update: {},
    create: {
      email: "ingrid@4kteam.com",
      password: hashedPassword,
      name: "Ingrid",
      role: "ADMIN",
      userType: "COACH",
    },
  })

  console.log("Coaches ADMIN criados:", { gabriel, ingrid })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
