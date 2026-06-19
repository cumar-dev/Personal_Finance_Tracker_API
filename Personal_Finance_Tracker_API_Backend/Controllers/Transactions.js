import Transactions from "../Models/Transactions.js";

export const createTransaction = async (req, res, next) => {
  try {
    const newTransaction = await Transactions.create({
      ...req.body,
      userId: req.user._id,
    });
    res.status(201).json(newTransaction);
  } catch (error) {
    next(error);
  }
};

export const getAllTransactions = async (req, res, next) => {
  try {
    const getTransactions = await Transactions.find({ userId: req.user._id });
    res.json(getTransactions);
  } catch (error) {
    next(error);
  }
};

export const getOneTransaction = async (req, res, next) => {
  const { id } = req.params;
  try {
    const oneTransaction = await Transactions.findOne({
      id: id,
      userId: req.user._id,
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
  const { id } = req.params;
  try {
    const transaction = await Transactions.findByIdAndUpdate(
      { _id: id, userId: req.user._id },
      req.body,
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
  const { id } = req.params;
  try {
    const transaction = await Transactions.findByIdAndDelete({
      _id: id,
      userId: req.user._id,
    });
    if (!transaction) {
      return res
        .status(404)
        .json({ message: "transaction need to delete not found" });
    }
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
      1
    );

    const endOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1
    );

    const summary = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
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