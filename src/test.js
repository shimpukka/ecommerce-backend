import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const newUser = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
      password: 'hashed_password_here'
    },
  });
  console.log('Created user:', newUser);

  const allUsers = await prisma.user.findMany();
  console.log('All users:', allUsers);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
