import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: "Ceremonial Grade Matcha Powder",
      description: "Premium Japanese ceremonial grade matcha powder. 30g tin, perfect for traditional tea ceremonies.",
      price: 45.99,
      stock: 30
    },
    {
      name: "Culinary Grade Matcha Powder",
      description: "High-quality culinary matcha powder for baking, smoothies, and cooking. 100g bag.",
      price: 24.99,
      stock: 50
    },
    {
      name: "Bamboo Matcha Whisk (Chasen)",
      description: "Traditional bamboo whisk for preparing matcha tea. Handcrafted in Japan, 80 prongs.",
      price: 18.99,
      stock: 25
    },
    {
      name: "Ceramic Matcha Bowl (Chawan)",
      description: "Beautiful handcrafted ceramic matcha bowl. Perfect for traditional tea preparation.",
      price: 32.99,
      stock: 20
    },
    {
      name: "Dark Chocolate Matcha Truffles",
      description: "Luxury dark chocolate truffles filled with matcha ganache. Box of 12 pieces.",
      price: 16.99,
      stock: 40
    }
  ];

  console.log("🌱 Starting to seed products...");

  for (const product of products) {
    try {
      const createdProduct = await prisma.product.create({
        data: product
      });
      console.log(`✅ Created: ${createdProduct.name} - $${createdProduct.price}`);
    } catch (error) {
      console.error(`❌ Failed to create ${product.name}:`, error.message);
    }
  }

  console.log("🎉 Product seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
