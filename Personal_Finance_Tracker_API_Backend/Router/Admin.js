import express from "express";
import { protectedRout } from "../Middlewares/Authentication.js";
import { authorization } from "../Middlewares/Authorization.js";
const router = express.Router();
router.get("/dashboard", protectedRout, authorization("admin"), (req, res) => {
  res.json({ message: `welcome to admin dashboard ${req.user.name}` });
});
export default router;