import express from "express";
import mongoose from "mongoose";
import dotnev from "dotenv";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { Logger } from "./Middlewares/Logger.js";
import { errorHandler } from "./Middlewares/errorHandler.js";
import authRout from "./Router/Auth.js"
dotnev.config();
mongoose.set("sanitizeFilter", true);
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(Logger);
app.use("/auth", )
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URL_DEV)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(
        `🚀 server at http://localhost:${PORT} connected successfully`,
      );
    });
  })
  .catch((error) => {
    console.error("❌ DB connection error:", error);
  });
