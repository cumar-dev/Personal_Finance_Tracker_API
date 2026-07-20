import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { Logger } from "./Middlewares/Logger.js";
import { errorHandler } from "./Middlewares/errorHandler.js";
import authRout from "./Router/Auth.js";
import adminRout from "./Router/Admin.js";
import uploadRout from "./Router/Upload.js";
import transactionRout from "./Router/Transaction.js";
import { swaggerSpec } from "./Utils/Swagger.js";
import { limiter } from "./Middlewares/rateLimiter.js";
import cloudinary from "./Utils/Cloudinary.js";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.LOCAL_HOST],
    credentials: true,
  }),
);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "https://personal-finance-tracker-apiatfintrack.onrender.com",
        ],
          imgSrc: ["'self'", "data:", "blob:"],
      },
    },
  })
);
app.use(limiter);
app.use(Logger);
app.use(
  "/api/Personal_Finance_Tracker_API-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.get("/health", (req, res) => {
  res.send("Server is running");
});
app.use("/api/auth", authRout);
app.use("/api/admin", adminRout);
app.use("/api/upload", uploadRout);
app.use("/api/transaction", transactionRout);
app.use("/cloudinary-test", async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

if (process.env.NODE_ENV === "production") {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}
app.use(errorHandler);

mongoose
  .connect(
    process.env.NODE_ENV == "development"
      ? process.env.MONGO_URL_DEV
      : process.env.MONGO_URL_PRO,
  )
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
