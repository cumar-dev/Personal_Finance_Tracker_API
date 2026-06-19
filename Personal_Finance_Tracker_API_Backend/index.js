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
import uploadRout from "./Router/Upload.js"
import { swaggerSpec } from "./Utils/Swagger.js";
import { limiter } from "./Middlewares/rateLimiter.js";
dotenv.config();
mongoose.set("sanitizeFilter", true);
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.LOCAL_HOST],
  credentials: true
}));
app.use(helmet());
app.use(limiter);
app.use(Logger);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.get("/", (req, res) => {
  res.send("Server is running");
});
app.use("/auth", authRout);
app.use("/admin", adminRout);
app.use("/upload", uploadRout);
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
