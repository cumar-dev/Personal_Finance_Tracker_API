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

export const logIn = (req, res, next) => {
  let { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    email = email.toLowerCase();
    const emailExist = await User.findOne({email});
   if (!emailExist || !(await emailExist.comparePassword(password))) {
      return res.status(401).json({ message: "invalid email or password" });
    }
    const token = jwtToken(emailExist._id);
    return res.json({
        token,
        user: {
            id: emailExist.id,
            name: emailExist.name,
            email: emailExist.email,
            password: emailExist.password,
            role: emailExist.role,
            profile: emailExist.profile
        }
    })
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