import express from "express";
import { protectedRout } from "../Middlewares/Authentication.js";
import { createTransaction, getAllTransactions, getOneTransaction, updateTransaction } from "../Controllers/Transactions.js";
const router = express.Router();
router.get("/allTransaction", protectedRout, getAllTransactions);
router.get("/oneTransaction:id", protectedRout, getOneTransaction);
router.get("/monthly-summary", )
router.post("/createTransaction", protectedRout, createTransaction);
router.put("/updateTransaction:id", protectedRout, updateTransaction);
export default router;