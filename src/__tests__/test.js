// // src/tests/test.cjs
// const request = require('supertest');
// const app = require('../app.js'); // make sure server.js exports the Express app
// const db= require('../models/index.js')
import  request  from "supertest";
import app from '../app.js'
import db from '../models/index.js'
let customerToken;
let adminToken;
let categoryId;
let productId;

beforeAll(async () => {
    // Sync database & seed demo data
    await db.sequelize.sync({ force: true });

    // Seed admin and customer
    await db.User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
    });

    await db.User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'customer'
    });
});

afterAll(async () => {
    await db.sequelize.close();
});

describe('Authentication', () => {
    test('Admin login', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@example.com', password: 'password123' });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
        adminToken = res.body.token;
    });

    test('Customer login', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'john@example.com', password: 'password123' });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
        customerToken = res.body.token;
    });
});

describe('Category Routes', () => {
    test('Admin can create category', async () => {
        const res = await request(app)
            .post('/api/categories')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Electronics' });
        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe('Electronics');
        categoryId = res.body.id;
    });

    test('List categories', async () => {
        const res = await request(app).get('/api/categories');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe('Product Routes', () => {
    test('Admin can create product', async () => {
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .field('name', 'iPhone 15')
            .field('price', 999)
            .field('stock', 50)
            .field('categoryId', categoryId);
        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe('iPhone 15');
        productId = res.body.id;
    });

    test('Customer can list products with filters', async () => {
        const res = await request(app)
            .get('/api/products')
            .query({ search: 'iPhone', minPrice: 500, maxPrice: 1500 });
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});

describe('Cart Routes', () => {
    test('Customer can add product to cart', async () => {
        const res = await request(app)
            .post('/api/cart/add')
            .set('Authorization', `Bearer ${customerToken}`)
            .send({ productId, quantity: 2 });
        expect(res.statusCode).toBe(200);
        expect(res.body.items.length).toBe(1);
    });

    test('Customer can view cart', async () => {
        const res = await request(app)
            .get('/api/cart')
            .set('Authorization', `Bearer ${customerToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.items.length).toBe(1);
    });

    test('Customer can remove product from cart', async () => {
        const res = await request(app)
            .post('/api/cart/remove')
            .set('Authorization', `Bearer ${customerToken}`)
            .send({ productId });
        expect(res.statusCode).toBe(200);
        expect(res.body.items.length).toBe(0);
    });
});

describe('Order Routes', () => {
    test('Customer can place order', async () => {
        // Add product first
        await request(app)
            .post('/api/cart/add')
            .set('Authorization', `Bearer ${customerToken}`)
            .send({ productId, quantity: 1 });

        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${customerToken}`);
        expect(res.statusCode).toBe(201);
        expect(res.body.items.length).toBe(1);
    });

    test('Customer can view order history', async () => {
        const res = await request(app)
            .get('/api/orders')
            .set('Authorization', `Bearer ${customerToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});
