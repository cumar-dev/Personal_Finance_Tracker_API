import express from "express";
import { protectedRout } from "../Middlewares/Authentication.js";
import { uploadFile } from "../Controllers/Upload.js";
import { upload } from "../Middlewares/Upload.js";
const router = express.Router();
/**
 * @swagger
 * /upload/profile-picture:
 *   post:
 *     summary: Upload profile picture
 *     tags: [Upload]
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
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/profile-picture", protectedRout, upload.single("file"), uploadFile)
export default router;