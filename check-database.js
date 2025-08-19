import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('Checking database tables...\n');
    
    // Check users
    const userCount = await prisma.user.count();
    console.log(`Users: ${userCount} records`);
    
    // Check products
    const productCount = await prisma.product.count();
    console.log(`Products: ${productCount} records`);
    
    // Check orders
    const orderCount = await prisma.order.count();
    console.log(`Orders: ${orderCount} records`);
    
    // Check order items
    const orderItemCount = await prisma.orderItem.count();
    console.log(`Order Items: ${orderItemCount} records`);
    
    console.log('\nDatabase is empty. You can:');
    console.log('1. Start your server with: npm run dev');
    console.log('2. Use your API endpoints to create users, products, etc.');
    console.log('3. Or use Prisma Studio to manually add data: npx prisma studio');
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
