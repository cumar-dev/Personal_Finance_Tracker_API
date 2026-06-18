import User from "../Models/User.js";
import { jwtToken } from "../Utils/jwtToken.js";
export const signUp = async (req, res, next) => {
  let { name, email, password, role, profile } = req.body;
  try {
    if (!name || !email || !password || !role || !profile) {
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
      role,
      profile,
    });
    const token = jwtToken(createUser._id);
    return res.status(201).json({
      token,
      user: {
        id: createUser.id,
        name: createUser.name,
        email: createUser.email,
        password: createUser.password,
        role: createUser.role,
        profile: createUser.profile,
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
    message: "Logged out successfully"
  });
};