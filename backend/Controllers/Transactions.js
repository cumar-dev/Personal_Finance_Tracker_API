import mongoose from "mongoose";
import Transactions from "../Models/Transactions.js";

const getAuthenticatedUserId = (user) => new mongoose.Types.ObjectId(user._id);

const stripProtectedFields = (body = {}) => {
  const { userId, _id, ...data } = body;
  return data;
};

export const createTransaction = async (req, res, next) => {
  try {
    const newTransaction = await Transactions.create({
      ...stripProtectedFields(req.body),
      userId: getAuthenticatedUserId(req.user),
    });
    res.status(201).json(newTransaction);
  } catch (error) {
    next(error);
  }
};

export const getAllTransactions = async (req, res, next) => {
  try {
    const getTransactions = await Transactions.find({
      userId: getAuthenticatedUserId(req.user),
    });
    res.json(getTransactions);
  } catch (error) {
    next(error);
  }
};

export const getOneTransaction = async (req, res, next) => {
  const id = req.params.id?.trim();
  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid transaction id" });
    }

    const oneTransaction = await Transactions.findOne({
      _id: id,
      userId: getAuthenticatedUserId(req.user),
    });
    if (!oneTransaction) {
      return res.status(404).json({
        message: "Transactions not found",
      });
    }
    res.json(oneTransaction);
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req, res, next) => {
  const id = req.params.id?.trim();
  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid transaction id" });
    }

    const transaction = await Transactions.findOneAndUpdate(
      { _id: id, userId: getAuthenticatedUserId(req.user) },
      stripProtectedFields(req.body),
      { new: true },
    );
    if (!transaction) {
      return res
        .status(404)
        .json({ message: "transaction updating not found" });
    }
    res.json({
      transaction,
      message: "transaction updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  const id = req.params.id?.trim();
  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid transaction id" });
    }

    const transaction = await Transactions.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (
      transaction.userId.toString() !==
      getAuthenticatedUserId(req.user).toString()
    ) {
      return res.status(403).json({
        message:
          "You can only delete your own transactions. Login again and use the same Bearer token you used to create it.",
      });
    }

    await transaction.deleteOne();
    res.json({ message: "transaction deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const getRangeTotals = async (userId, start, end) => {
  const result = await Transactions.aggregate([
    { $match: { userId, date: { $gte: start, $lt: end } } },
    { $group: { _id: "$type", total: { $sum: "$amount" } } },
  ]);
  const totals = { income: 0, expense: 0 };
  result.forEach((r) => {
    totals[r._id] = r.total;
  });
  return totals;
};

export const getMonthlySummary = async (req, res, next) => {
  try {
    const userId = getAuthenticatedUserId(req.user);
    const now = new Date();

    // ---- Current month category breakdown (unchanged behavior) ----
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );
    const startOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    const summary = await Transactions.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfThisMonth, $lt: startOfNextMonth },
        },
      },
      {
        $group: {
          _id: { category: "$category", type: "$type" },
          total: { $sum: "$amount" },
        },
      },
    ]);

    const income = summary
      .filter((item) => item._id.type === "income")
      .map((item) => ({ category: item._id.category, total: item.total }));

    const expense = summary
      .filter((item) => item._id.type === "expense")
      .map((item) => ({ category: item._id.category, total: item.total }));

    // ---- Date ranges for each comparison period ----

    // Week: last 7 days vs the 7 days before that
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - 6);
    startOfThisWeek.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setDate(now.getDate() + 1);
    endOfToday.setHours(0, 0, 0, 0);
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

    // 6 months: last 6 months vs the 6 months before that
    const startOfThis6Month = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const startOfPrev6Month = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    // Year: last 12 months vs the 12 months before that
    const startOfThisYear = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const startOfPrevYear = new Date(now.getFullYear(), now.getMonth() - 23, 1);

    const [
      weekCurrent,
      weekPrevious,
      monthCurrent,
      monthPrevious,
      sixMonthCurrent,
      sixMonthPrevious,
      yearCurrent,
      yearPrevious,
    ] = await Promise.all([
      getRangeTotals(userId, startOfThisWeek, endOfToday),
      getRangeTotals(userId, startOfLastWeek, startOfThisWeek),
      getRangeTotals(userId, startOfThisMonth, startOfNextMonth),
      getRangeTotals(userId, startOfLastMonth, startOfThisMonth),
      getRangeTotals(userId, startOfThis6Month, startOfNextMonth),
      getRangeTotals(userId, startOfPrev6Month, startOfThis6Month),
      getRangeTotals(userId, startOfThisYear, startOfNextMonth),
      getRangeTotals(userId, startOfPrevYear, startOfThisYear),
    ]);

    res.status(200).json({
      success: true,
      income,
      expense,
      comparison: {
        week: { current: weekCurrent, previous: weekPrevious },
        month: { current: monthCurrent, previous: monthPrevious },
        sixMonth: { current: sixMonthCurrent, previous: sixMonthPrevious },
        year: { current: yearCurrent, previous: yearPrevious },
      },
    });
  } catch (error) {
    next(error);
  }
};


export const getRecentTransactions = async (req, res, next) => {
  try {
    const transactions = await Transactions.find({
      userId: getAuthenticatedUserId(req.user),
    })
      .sort({ createdAt: -1 }) 
      .limit(5); 

    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};