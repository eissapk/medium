import "dotenv/config";
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

// routes
import articleRoute from "./routes/article";
import userRoute from "./routes/user";

// middleware
app.use(express.json({ limit: EXPRESS_LIMIT }));
app.use(cookieParser());
if (isDev) app.use(logger);
else app.use(morgan("tiny"));

app.use(express.static(path.resolve(__dirname, "../dist"))); // for production -- comment if you use frontend seperatly
// todo change port to vite port: 5173 if you use vite
app.use(cors({ origin: isDev ? `http://localhost:${PORT}` : DOMAIN, credentials: true }));

// routes
// app.use(require("./routes").Router);
app.use("/api/user", userRoute);
app.use("/api/article", articleRoute);
// had to serve frontend from here due to cookies issue with different domains -- if you want to reveert delete this line and dist folder
app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "../dist/index.html"))); // for production -- comment if you use frontend seperatly

// static files
app.use("/api/assets/images", express.static(path.resolve(__dirname, "./assets/images")));

// db
connectDB();

// init server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
