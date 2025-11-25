/**
 * Cart routes
 */
import { Router } from 'express';
import { body } from 'express-validator';
import * as CartController from '../controllers/cartController.js';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';

const router = Router();
router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart operations
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: View items in cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns cart with items
 *       401:
 *         description: Unauthorized
 */
router.get('/', CartController.viewCart);

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add a product to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, quantity]
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 5
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Product added to cart
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.post(
  '/add',
  body('productId').isInt(),
  body('quantity').isInt({ min: 1 }),
  validate,
  CartController.addToCart
);

/**
 * @swagger
 * /api/cart/remove:
 *   post:
 *     summary: Remove a product from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Product removed from cart
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found in cart
 */
router.post(
  '/remove',
  body('productId').isInt(),
  validate,
  CartController.removeFromCart
);

export default router;
