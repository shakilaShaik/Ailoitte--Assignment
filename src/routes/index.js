import { Router } from 'express';
import authRoutes from './auth.js';
import productRoutes from './product.js';
import categoryRoutes from './category.js';
import cartRoutes from './cart.js';
import orderRoutes from './order.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);

export default router;
