import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await hash("password123iWishApp", 10);
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      password,
      lists: {
        create: [
          {
            name: "Birthday Wishlist",
            type: "wishlist",
            description: "My birthday wishes",
            visibility: "public",
            wishes: {
              create: [
                {
                  title: "New Laptop",
                  desireLvl: 9,
                  price: 1200,
                  currency: "USD",
                  description: "A powerful laptop for work and gaming",
                },
                {
                  title: "Wireless Headphones",
                  desireLvl: 7,
                  price: 200,
                  currency: "USD",
                  description: "Noise-cancelling headphones for music",
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
