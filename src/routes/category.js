/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Product category management
 */

import { Router } from 'express';
import { body } from 'express-validator';
import * as CategoryController from '../controllers/categoryController.js';
import auth from '../middlewares/auth.js';
import isAdmin from '../middlewares/isAdmin.js';
import validate from '../middlewares/validate.js';

const router = Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *       500:
 *         description: Server error
 */
router.get('/', CategoryController.listCategories);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin required)
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  auth,
  isAdmin,
  body('name').notEmpty(),
  validate,
  CategoryController.createCategory
);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Home Appliances
 *     responses:
 *       200:
 *         description: Category updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin required)
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.put('/:id', auth, isAdmin, CategoryController.updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin required)
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', auth, isAdmin, CategoryController.deleteCategory);

export default router;
