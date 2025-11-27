/**
 * Auth routes
 */
import { Router } from "express";
import { body } from "express-validator";
import * as AuthController from "../controllers/authController.js";
import validate from "../middlewares/validate.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User signup & login
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: John Doe }
 *               email: { type: string, example: johndoe@example.com }
 *               password: { type: string, example: secret123 }
 *     responses:
 *       201: { description: User created successfully }
 *       400: { description: Validation error }
 */
router.post(
  "/signup",
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Min 6 characters"),
  validate,
  AuthController.signup
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user and receive JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: johndoe@example.com }
 *               password: { type: string, example: secret123 }
 *     responses:
 *       200: { description: Logged in successfully }
 *       401: { description: Invalid credentials }
 */
router.post(
  "/login",
  body("email").isEmail().withMessage("Valid email required"),
  body("password").exists().withMessage("Password required"),
  validate,
  AuthController.login
);

export default router;
