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

export const getMonthlySummary = async (req, res, next) => {
  try {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );

    const endOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1,
    );

    const summary = await Transactions.aggregate([
      {
        $match: {
          userId: getAuthenticatedUserId(req.user),
          date: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: {
            category: "$category",
            type: "$type",
          },
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const income = summary
      .filter((item) => item._id.type === "income")
      .map((item) => ({
        category: item._id.category,
        total: item.total,
      }));

    const expense = summary
      .filter((item) => item._id.type === "expense")
      .map((item) => ({
        category: item._id.category,
        total: item.total,
      }));

    res.status(200).json({
      success: true,
      income,
      expense,
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