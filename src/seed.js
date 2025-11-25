import bcrypt from 'bcrypt';
import { Sequelize } from 'sequelize';
import { User, Category, Product, Cart, Order, OrderItem } from '../models/index.cjs';
import faker from 'faker'; // npm install faker

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
  }
);

 async function seed() {
  try {
    await sequelize.sync({ force: true }); // WARNING: drops tables and recreates

    // --- Users ---
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    });

    const customer = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: 'customer',
    });

    // --- Categories ---
    const electronics = await Category.create({ name: 'Electronics' });
    const clothing = await Category.create({ name: 'Clothing' });

    // --- Products ---
    const products = [];

    // Create 50 products for Electronics
    for (let i = 1; i <= 50; i++) {
      const product = await Product.create({
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price(50, 1500, 2)),
        stock: Math.floor(Math.random() * 100) + 1,
        categoryId: electronics.id,
      });
      products.push(product);
    }

    // Create 50 products for Clothing
    for (let i = 1; i <= 50; i++) {
      const product = await Product.create({
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price(10, 200, 2)),
        stock: Math.floor(Math.random() * 200) + 1,
        categoryId: clothing.id,
      });
      products.push(product);
    }

    // --- Cart (add one random product to customer cart) ---
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    await Cart.create({
      userId: customer.id,
      productId: randomProduct.id,
      quantity: 2,
      priceAtAdding: randomProduct.price,
    });

    // --- Orders ---
    const order = await Order.create({
      userId: customer.id,
      totalAmount: randomProduct.price * 2,
    });

    await order.createOrderItem({
      productId: randomProduct.id,
      quantity: 2,
      priceAtOrder: randomProduct.price,
    });

    console.log('✅ 100 Products (50 per category) and demo data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    process.exit(1);
  }
}

seed();
