import express from "express";
import userRoutes from "./routes/user";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config();
const isDev = Number(process.env.DEV || 1);

// express app
const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
	console.log(req.path, req.method);
	next(); // must be called to move on the next routes (e.g. app.use('/api', ...))
});

app.use(express.static(path.resolve(__dirname, "../client/dist"))); // for production
app.use(cors({ origin: isDev ? "http://localhost:5173" : "https://customDomain.com", credentials: true })); // strict route for certain domains

// routes
app.use("/api/user", userRoutes);

// start -- testing cookie parser
app.get("/api/cookie", (req, res) => {
	res
		.status(202)
		.cookie("Name", "Eissa", {
			sameSite: "strict",
			path: "/",
			expires: new Date(new Date().getTime() + 30 * 1000),
			httpOnly: true,
			// signed: true, // gives error if not matched
			// secure: true, // cookie created only on https protocols
		}) // cookie for 30 secs
		.json({ success: true, message: "created cookie" });
});

app.get("/api/delete-cookie", (req, res) => {
	// Cookies that have not been signed
	console.log("Cookies: ", req.cookies);
	// Cookies that have been signed
	// console.log("Signed Cookies: ", req.signedCookies);

	res.status(202).clearCookie("Name").json({ success: true, message: "cleared cookie" });
});
// end -- testing cookie parser

app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "../client/dist/index.html"))); // for production

// connect to db
mongoose
	.connect(process.env.DB || "")
	.then(() => console.log("Connected to MongoDB"))
	.catch(err => {
		console.error(err);
		process.exit(1);
	});

// listen for requests
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
