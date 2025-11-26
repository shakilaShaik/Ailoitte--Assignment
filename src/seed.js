// seed.js
import bcrypt from "bcrypt";
import db from "../src/models/index.js";   // <-- uses your existing models & sequelize instance
import { faker } from "@faker-js/faker";

const { sequelize, User, Category, Product, Cart, CartItem, Order, OrderItem } = db;

async function seed() {
  try {
    console.log("⏳ Syncing database...");
    await sequelize.sync({ force: true });

    // ---------------------------------------------------------
    // USERS
    // ---------------------------------------------------------
    const hashedPassword = await bcrypt.hash("password123", 10);

    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });

    const customer = await User.create({
      name: "John Doe",
      email: "john1@example.com",
      password: hashedPassword,
      role: "customer",
    });

    // ---------------------------------------------------------
    // CATEGORIES
    // ---------------------------------------------------------
    const electronics = await Category.create({ name: "Electronics" });
    const clothing = await Category.create({ name: "Clothing" });

    // ---------------------------------------------------------
    // PRODUCTS
    // ---------------------------------------------------------
    const products = [];

    for (let i = 0; i < 50; i++) {
      products.push(
        await Product.create({
          name: faker.commerce.productName(),
          price: parseFloat(faker.commerce.price(50, 1500)),
          stock: faker.number.int({ min: 1, max: 100 }),
          categoryId: electronics.id,
        })
      );
    }

    for (let i = 0; i < 50; i++) {
      products.push(
        await Product.create({
          name: faker.commerce.productName(),
          price: parseFloat(faker.commerce.price(10, 200)),
          stock: faker.number.int({ min: 1, max: 200 }),
          categoryId: clothing.id,
        })
      );
    }

    // ---------------------------------------------------------
    // CART + CART ITEMS
    // ---------------------------------------------------------
    const customerCart = await Cart.create({
      userId: customer.id,
    });

    const randomProduct = products[Math.floor(Math.random() * products.length)];

    await CartItem.create({
      cartId: customerCart.id,
      productId: randomProduct.id,
      quantity: 2,
      price: randomProduct.price,
    });

    // ---------------------------------------------------------
    // ORDER + ORDER ITEMS
    // ---------------------------------------------------------
    const order = await Order.create({
      userId: customer.id,
      totalAmount: randomProduct.price * 2,
    });

    await OrderItem.create({
      orderId: order.id,
      productId: randomProduct.id,
      quantity: 2,
      price: randomProduct.price,
    });

    // ---------------------------------------------------------
    // DONE
    // ---------------------------------------------------------
    console.log("✅ Seed completed: Users, Categories, Products, Cart, Orders created!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding:", error);
    process.exit(1);
  }
}

seed();
