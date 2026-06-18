import User from "../Models/User.js";
import jwt from "jsonwebtoken";

export const protectedRout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "unAuthorized: no token" });
    }
    const token = authHeader.split("")[1];
    const decoded = await jwt.verify(token, process.env.JWT_SECERET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
     return res.status(401).json({ message: "unAuthorized: invalid token" });
  }
};
