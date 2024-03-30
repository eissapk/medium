import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import multer from "multer";
import { connectDB } from "./utils/mongo";
import { logger } from "./utils";
const { NODE_ENV, PORT, EXPRESS_LIMIT, DOMAIN } = process.env;
const isDev = NODE_ENV == "dev";
const app = express();

// routes
import articleRoute from "./routes/article";
import userRoute from "./routes/user";
import searchRoute from "./routes/search";
import uploadRoute from "./routes/upload";

// middleware
app.use(express.json({ limit: EXPRESS_LIMIT }));
app.use(express.urlencoded({ extended: false }));
// export const upload = multer({ ...multerConfig, storage: multer.diskStorage(multerConfig.storage) }).any();
// app.use(upload);
app.use(multer().any());
app.use(cookieParser());
if (isDev) app.use(logger);
else app.use(morgan("tiny"));

// app.use(express.static(path.resolve(__dirname, "../client"))); // for production -- comment if you use frontend seperatly
// todo change port to vite port: 5173 if you use vite
app.use(cors({ origin: isDev ? `http://localhost:${PORT}` : DOMAIN, credentials: true }));

// routes
// app.use(require("./routes").Router);
app.use("/api/user", userRoute);
app.use("/api/article", articleRoute);
app.use("/api/search", searchRoute);
app.use("/api/upload", uploadRoute);
// had to serve frontend from here due to cookies issue with different domains -- if you want to reveert delete this line and client folder
// app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "../client/index.html"))); // for production -- comment if you use frontend seperatly

// static files
app.use("/api/assets/images", express.static(path.resolve(__dirname, "./assets/images")));
app.use("/api/uploads", express.static(path.resolve(__dirname, "./uploads")));

// db
connectDB();

// init server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
