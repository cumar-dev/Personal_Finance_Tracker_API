import express from "express";
import { protectedRout } from "../Middlewares/Authentication.js";
import { createTransaction, deleteTransaction, getAllTransactions, getMonthlySummary, getOneTransaction, updateTransaction } from "../Controllers/Transactions.js";
const router = express.Router();
/**
 * @swagger
 * /transactions/all:
 *   get:
 *     summary: Get all transactions for logged-in user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 *       401:
 *         description: Unauthorized
 */
router.get("/all", protectedRout, getAllTransactions);
/**
 * @swagger
 * /transactions/one/{id}:
 *   get:
 *     summary: Get single transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction found
 *       404:
 *         description: Transaction not found
 */
router.get("/one/:id", protectedRout, getOneTransaction);
/**
 * @swagger
 * /transactions/monthly-summary:
 *   get:
 *     summary: Get monthly income & expense summary
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly summary data
 *       401:
 *         description: Unauthorized
 */
router.get("/monthly-summary", protectedRout, getMonthlySummary);
/**
 * @swagger
 * /transactions/create:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - title
 *               - type
 *               - category
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 150
 *               title:
 *                 type: string
 *                 example: Lunch
 *               type:
 *                 type: string
 *                 enum:
 *                   - income
 *                   - expense
 *               category:
 *                 type: string
 *                 example: Food
 *               date:
 *                 type: string
 *                 example: 2026-06-19
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/create", protectedRout, createTransaction);
/**
 * @swagger
 * /transactions/update/{id}:
 *   put:
 *     summary: Update a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               title:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *       404:
 *         description: Transaction not found
 */
router.put("/update/:id", protectedRout, updateTransaction);
/**
 * @swagger
 * /transactions/delete/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *       404:
 *         description: Transaction not found
 */
router.delete("/delete/:id", protectedRout, deleteTransaction);
export default router;