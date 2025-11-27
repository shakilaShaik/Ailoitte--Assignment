/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product listing, search, filters & admin product management
 */

import { Router } from 'express';
import multer from 'multer';
import { body, query } from 'express-validator';
import * as ProductController from '../controllers/productController.js';
import auth from '../middlewares/auth.js';
import isAdmin from '../middlewares/isAdmin.js';
import validate from '../middlewares/validate.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: List products with filters & pagination
 *     tags: [Products]
 *     description: >
 *       Retrieve products using multiple filters:
 *       - minPrice & maxPrice  
 *       - category  
 *       - search by product name  
 *       - pagination (page, limit)
 *     parameters:
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: category
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Products fetched successfully }
 *       500: { description: Server error }
 */
router.get(
  '/',
  [
    query('minPrice').optional().isFloat({ min: 0 }),
    query('maxPrice').optional().isFloat({ min: 0 }),
    query('category').optional().isInt(),
    query('search').optional().isString(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1 })
  ],
  validate,
  ProductController.listProducts
);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, price, stock]
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *               stock: { type: integer }
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201: { description: Product created successfully }
 *       400: { description: Validation error }
 *       401: { description: Unauthorized }
 *       403: { description: Admin access required }
 */
router.post(
  '/',
  auth,
  isAdmin,
  upload.single('image'),
  body('name').notEmpty(),
  body('price').isFloat({ gt: 0 }),
  body('stock').isInt({ min: 0 }),
  validate,
  ProductController.createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update an existing product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: integer
 *       - in: formData
 *         name: name
 *         type: string
 *         required: false
 *         description: Updated product name
 *       - in: formData
 *         name: description
 *         type: string
 *         required: false
 *         description: Updated product description
 *       - in: formData
 *         name: price
 *         type: number
 *         required: false
 *         description: Updated product price
 *       - in: formData
 *         name: image
 *         type: file
 *         required: false
 *         description: Upload a new product image (Cloudinary)
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put('/:id', auth, isAdmin, upload.single('image'), ProductController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Product deleted successfully }
 *       401: { description: Unauthorized }
 *       403: { description: Admin access required }
 *       404: { description: Product not found }
 */
router.delete('/:id', auth, isAdmin, ProductController.deleteProduct);

/**
 * @swagger
 * /api/products/admin:
 *   get:
 *     summary: List all products (Admin dashboard)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Products fetched successfully }
 *       401: { description: Unauthorized }
 *       403: { description: Admin access required }
 */
router.get('/admin', auth, isAdmin, ProductController.listAllProductsAdmin);

export default router;
