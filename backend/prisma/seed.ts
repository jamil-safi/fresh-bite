import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const categories = [
    { name: "Burgers", icon: "lunch_dining", color: "primary-container" },
    { name: "Pizza", icon: "local_pizza", color: "tertiary" },
    { name: "Asian", icon: "ramen_dining", color: "secondary" },
    { name: "Salads", icon: "eco", color: "surface-container-high" },
    { name: "Desserts", icon: "icecream", color: "primary-container" },
    { name: "Drinks", icon: "local_bar", color: "tertiary" },
  ];

  const categoryRecords: Record<string, string> = {};
  for (const c of categories) {
    const rec = await prisma.category.upsert({
      where: { name: c.name },
      update: {},
      create: c,
    });
    categoryRecords[c.name] = rec.id;
  }

  const restaurant = await prisma.restaurant.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Artisan Pizza & Pasta Co.",
      kitchen: "Downtown Kitchen",
      distanceMi: 1.2,
      isOpen: true,
    },
  });

  const restaurant2 = await prisma.restaurant.upsert({
    where: { id: "00000000-0000-0000-0000-000000000002" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000002",
      name: "The Burger Joint",
      kitchen: "Uptown Grill",
      distanceMi: 0.8,
      isOpen: true,
    },
  });

  const foods = [
    {
      name: "Truffle Wagyu Burger",
      description:
        "Double wagyu patty, truffle aioli, aged white cheddar, caramelized onions on brioche.",
      price: 14.99,
      imageUrl:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
      rating: 4.9,
      reviewCount: 320,
      tag: "Popular",
      category: "Burgers",
      restaurant: restaurant2.id,
    },
    {
      name: "Wood-Fired Margherita",
      description:
        "San Marzano tomatoes, fresh fior di latte mozzarella, basil, extra virgin olive oil.",
      price: 18.5,
      imageUrl:
        "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&q=80",
      rating: 4.8,
      reviewCount: 240,
      tag: "Chef Special",
      category: "Pizza",
      restaurant: restaurant.id,
    },
    {
      name: "Dragon Roll Supreme",
      description: "Shrimp tempura, avocado, freshwater eel, tobiko, sweet unagi reduction.",
      price: 16.0,
      imageUrl:
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80",
      rating: 4.9,
      reviewCount: 410,
      tag: "Trending",
      category: "Asian",
      restaurant: restaurant.id,
    },
    {
      name: "Avocado Quinoa Salad",
      description:
        "Organic quinoa, crispy panko avocado, mixed greens, cherry tomatoes, citrus dressing.",
      price: 12.5,
      imageUrl:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
      rating: 4.7,
      reviewCount: 185,
      tag: "Healthy",
      category: "Salads",
      restaurant: restaurant.id,
    },
    {
      name: "Molten Lava Cake",
      description: "Warm dark chocolate cake with a rich liquid chocolate center and vanilla bean ice cream.",
      price: 9.0,
      imageUrl:
        "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80",
      rating: 4.9,
      reviewCount: 512,
      tag: null,
      category: "Desserts",
      restaurant: restaurant2.id,
    },
    {
      name: "Southern Chicken Burger",
      description: "Buttermilk fried chicken breast, spicy honey glaze, house coleslaw, pickles.",
      price: 13.5,
      imageUrl:
        "https://images.unsplash.com/photo-1615297928064-24977384d0da?w=800&q=80",
      rating: 4.6,
      reviewCount: 190,
      tag: null,
      category: "Burgers",
      restaurant: restaurant2.id,
    },
    {
      name: "Spicy Pepperoni & Honey",
      description: "Crispy pepperoni, artisan mozzarella, chili-infused organic hot honey drizzle.",
      price: 17.0,
      imageUrl:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80",
      rating: 4.8,
      reviewCount: 295,
      tag: null,
      category: "Pizza",
      restaurant: restaurant.id,
    },
    {
      name: "Authentic Shoyu Ramen",
      description: "Slow-cooked chashu pork, marinated soft egg, spring onions, rich soy broth.",
      price: 15.5,
      imageUrl:
        "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800&q=80",
      rating: 4.7,
      reviewCount: 310,
      tag: null,
      category: "Asian",
      restaurant: restaurant.id,
    },
    {
      name: "Truffle Wild Mushroom Pizza",
      description: "Fior di latte, white truffle oil, thyme.",
      price: 24.5,
      imageUrl:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
      rating: 4.9,
      reviewCount: 88,
      tag: null,
      category: "Pizza",
      restaurant: restaurant.id,
    },
    {
      name: "Handmade Truffle Fettuccine",
      description: "Parmigiano-reggiano, black pepper.",
      price: 18.0,
      imageUrl:
        "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80",
      rating: 4.8,
      reviewCount: 64,
      tag: null,
      category: "Asian",
      restaurant: restaurant.id,
    },
  ];

  for (const f of foods) {
    const existing = await prisma.foodItem.findFirst({ where: { name: f.name } });
    if (!existing) {
      await prisma.foodItem.create({
        data: {
          name: f.name,
          description: f.description,
          price: f.price,
          imageUrl: f.imageUrl,
          rating: f.rating,
          reviewCount: f.reviewCount,
          tag: f.tag ?? undefined,
          categoryId: categoryRecords[f.category],
          restaurantId: f.restaurant,
        },
      });
    }
  }

  const demoPasswordHash = await bcrypt.hash("password123", 10);
  await prisma.user.upsert({
    where: { email: "demo@freshbites.com" },
    update: {},
    create: {
      firstName: "Demo",
      lastName: "User",
      email: "demo@freshbites.com",
      passwordHash: demoPasswordHash,
    },
  });

  console.log("Seed complete. Demo login: demo@freshbites.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
