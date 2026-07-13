import User from "../Models/User.js";
import Transaction from "../Models/Transactions.js";
import { jwtToken } from "../Utils/jwtToken.js";
export const signUp = async (req, res, next) => {
  let { name, email, password} = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    email = email.toLowerCase();

    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const createUser = await User.create({
      name,
      email,
      password,
      // role,
      // profile,
    });
    const token = jwtToken(createUser._id);
    return res.status(201).json({
      token,
      user: {
        id: createUser.id,
        name: createUser.name,
        email: createUser.email,
        password: createUser.password,
        // role: createUser.role,
        // profile: createUser.profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logIn = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    email = email.toLowerCase();

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwtToken(user._id);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logOut = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};


export const getAdminOverview = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalTransactions = await Transaction.countDocuments();

    const totals = await Transaction.aggregate([
      {
        $group: {
          _id: "$type",
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalIncome =
      totals.find((item) => item._id === "income")?.total || 0;

    const totalExpense =
      totals.find((item) => item._id === "expense")?.total || 0;

    const topSpendingCategories = await Transaction.aggregate([
      {
        $match: {
          type: "expense",
        },
      },
      {
        $group: {
          _id: "$category",
          totalSpent: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          totalSpent: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalSpent: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalTransactions,
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        topSpendingCategories,
      },
    });
  } catch (error) {
    next(error);
  }
};