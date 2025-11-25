/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Shopping order management
 */

import { Router } from 'express';
import * as OrderController from '../controllers/orderController.js';
import auth from '../middlewares/auth.js';

const router = Router();
router.use(auth);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place an order from the cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     description: Converts current user's cart items into an order. Prices are captured based on the time items were added to the cart.
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Cart is empty / validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', OrderController.placeOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get user's order history
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     description: Fetches all past orders of the logged-in user.
 *     responses:
 *       200:
 *         description: Order history fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', OrderController.orderHistory);

export default router;
