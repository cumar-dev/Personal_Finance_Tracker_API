import express from "express";
import { logIn, logOut, signUp } from "../Controllers/Auth.js";
import { protectedRout } from "../Middlewares/Authentication.js";
import { validate } from "../Middlewares/Validate.js";
import { userSchema } from "../Schema/User.js";
const router = express.Router();
router.get("/test", (req, res) => {
  res.send("Auth Route Working");
});
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Omar Abdi
 *               email:
 *                 type: string
 *                 example: omar@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: user
 *               profile:
 *                 type: string
 *                 example: https://avatar.com/me.png
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post("/register", validate(userSchema), signUp);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: omar@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful (returns token)
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", logIn);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", protectedRout, logOut);
/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data (password excluded)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                   enum: [user, admin]
 *                 profile:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", protectedRout, (req, res) => {
  res.json(req.user);
});
export default router;