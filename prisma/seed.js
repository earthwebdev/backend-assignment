import prisma from "../models/prismaclient.model.js";
import PrismaClient  from "../models/prismaclient.model.js";
//const prisma = new PrismaClient()

async function main() {
  /* const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      name: 'Alice',
      posts: {
        create: {
          title: 'Check out Prisma with Next.js',
          content: 'https://www.prisma.io/nextjs',
          published: true,
        },
      },
    },
  }) */
  const user = await prisma.user.upsert({
    create: {
        id: 1,
        fullname: 'peter singh',
        age: 25,
        phone: '1234567890',
        gender: 'Male',
        role: 'ADMIN',
        address: 'patan dhoka lalitpur',
        email: 'peter@email.com',
        password: 'peter123!',
      },
  })

  const user2 = await prisma.user.upsert({
    create: {
        id: 1,
        fullname: 'peter selby',
        age: 34,
        phone: '9876543210',
        gender: 'Male',
        role: 'USER',
        address: 'patan dhoka lalitpur',
        email: 'peter@gmail.com',
        password: 'peter123!',
      },
  })
  
  console.log({ user, user2 })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })