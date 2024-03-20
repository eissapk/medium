import "dotenv/config";
// require("dotenv").config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import { connectDB } from "./utils/mongo";
import { logger } from "./utils";
const { NODE_ENV, PORT, EXPRESS_LIMIT, DOMAIN } = process.env;

const isDev = NODE_ENV == "dev";
const app = express();

// middleware
app.use(express.json({ limit: EXPRESS_LIMIT }));
app.use(cookieParser());
if (!isDev) app.use(morgan("tiny"));
else app.use(logger);

// todo change port to vite port: 5173
app.use(cors({ origin: isDev ? `http://localhost:${PORT}` : DOMAIN, credentials: true }));

// routes
app.use(require("./routes").Router);

// static files
app.use("/api/assets/images", express.static(path.resolve(__dirname, "./assets/images")));

// db
connectDB();

// init server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
