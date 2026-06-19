import express from "express";
import { protectedRout } from "../Middlewares/Authentication.js";
import { authorization } from "../Middlewares/Authorization.js";
import { adminOnly } from "../Middlewares/Admin.js";
import { getAdminOverview } from "../Controllers/Auth.js";
const router = express.Router();
/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Admin dashboard access
 *     description: Only accessible by authenticated users with admin role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome message for admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: welcome to admin dashboard
 *       401:
 *         description: Unauthorized (no token or invalid token)
 *       403:
 *         description: Forbidden (not admin)
 */
router.get("/dashboard", protectedRout, authorization("admin"), (req, res) => {
  res.json({ message: `welcome to admin dashboard ${req.user.name}` });
});
/**
 * @swagger
 * /admin/overview:
 *   get:
 *     summary: Get admin dashboard overview (only admin users)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin overview data (users, transactions, income, expense, top categories)
 *       401:
 *         description: Unauthorized (no token)
 *       403:
 *         description: Forbidden (not admin)
 */
router.get("/overview", protectedRout, adminOnly, getAdminOverview);
export default router;