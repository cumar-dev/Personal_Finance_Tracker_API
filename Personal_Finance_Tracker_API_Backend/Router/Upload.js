import express from "express";
import { protectedRout } from "../Middlewares/Authentication.js";
import { uploadFile } from "../Controllers/Upload.js";
import { upload } from "../Middlewares/Upload.js";
const router = express.Router();
/**
 * @swagger
 * /auth/profile-picture:
 *   post:
 *     summary: Upload user profile picture
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 */
router.post("/profile-picture", protectedRout, upload.single("file"), uploadFile);
export default router;