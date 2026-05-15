import { PrismaClient, Role, ActivityType, User, Category, Product } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';

const pg_adapter = new PrismaPg({connectionString: process.env.DATABASE_URL})
const prisma = new PrismaClient({
   adapter: pg_adapter
});
async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.userActivity.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
      role: Role.ADMIN,
      isVerified: true,
    },
  });

  // Create regular users
  const users: User[] = [];
  for (let i = 0; i < 5; i++) {
    const password = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: password,
        role: Role.USER,
        isVerified: faker.datatype.boolean(),
      },
    });
    users.push(user);
  }

  // Create Categories
  const categories: Category[] = [];
  const categoryNames = ['Electronics', 'Clothing', 'Home & Garden', 'Books', 'Toys'];
  for (const name of categoryNames) {
    const category = await prisma.category.create({
      data: { name },
    });
    categories.push(category);
  }

  // Create Products
  const products: Product[] = [];
  for (let i = 0; i < 20; i++) {
    const category = faker.helpers.arrayElement(categories);
    const product = await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        imageUrl: `https://picsum.photos/seed/${faker.string.uuid()}/300/300`,
        categoryId: category.id,
      },
    });
    products.push(product);
  }

  // Create some initial activities
  for (const user of users) {
    const numActivities = faker.number.int({ min: 5, max: 15 });
    for (let i = 0; i < numActivities; i++) {
      const product = faker.helpers.arrayElement(products);
      await prisma.userActivity.create({
        data: {
          userId: user.id,
          productId: product.id,
          type: faker.helpers.arrayElement([ActivityType.VIEW, ActivityType.LIKE]),
        },
      });
    }
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
