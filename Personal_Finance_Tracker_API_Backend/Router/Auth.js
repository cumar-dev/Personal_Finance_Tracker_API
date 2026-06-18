import express from "express";
import { logIn, logOut, signUp } from "../Controllers/Auth.js";
import { protectedRout } from "../Middlewares/Authentication.js";
import { validate } from "../Middlewares/Validate.js";
import { userSchema } from "../Schema/User.js";
const router = express.Router();
router.post("/register", validate(userSchema), signUp)
router.post("/login", protectedRout, logIn);
router.post("/logout", protectedRout, logOut)
export default router;