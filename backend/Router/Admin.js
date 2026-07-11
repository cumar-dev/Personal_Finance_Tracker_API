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
 *     summary: Admin dashboard (admin only)
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
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Welcome to admin dashboard Omar
 *       401:
 *         description: Unauthorized
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
 *     summary: Get admin dashboard overview
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin overview data (users, transactions, income, expense, top categories)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: number
 *                       example: 10
 *                     totalTransactions:
 *                       type: number
 *                       example: 50
 *                     totalIncome:
 *                       type: number
 *                       example: 5000
 *                     totalExpense:
 *                       type: number
 *                       example: 3000
 *                     balance:
 *                       type: number
 *                       example: 2000
 *                     topSpendingCategories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           category:
 *                             type: string
 *                             example: Food
 *                           totalSpent:
 *                             type: number
 *                             example: 1200
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 */
router.get("/overview", protectedRout, adminOnly, getAdminOverview);
export default router;