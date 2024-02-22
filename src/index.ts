import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./utils/mongo";
import { logger } from "./utils";
const { NODE_ENV, PORT, EXPRESS_LIMIT, DOMAIN } = process.env;

const isDev = NODE_ENV == "dev";
const app = express();

// middleware
app.use(express.json({ limit: EXPRESS_LIMIT }));
app.use(cookieParser());
if (isDev) app.use(morgan("tiny"));
else app.use(logger);
app.use(cors({ origin: isDev ? `http://localhost:${PORT}` : DOMAIN, credentials: true }));

// routes
app.use(require("./routes").Router);

// db
connectDB();

// init server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
