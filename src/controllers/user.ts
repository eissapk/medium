import User from "../models/user";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

import { createToken, signup } from "../utils";

// login user
// todo handle status codes
// todo: add brute force attack protection , e.g. counter of failed login max 3 times and then block the user and force him to change password
export const loginUser = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) return res.status(400).json({ error: true, message: "All fields must be filled" });

	try {
		const user = await User.findOne({ email });
		if (!user) {
			throw new Error("Invalid login credentials"); // don't specify the real reason because of hackers
		}

		const match = await bcrypt.compare(password, user.password); // compare plain password with hashed one
		if (!match) {
			throw new Error("Invalid login credentials");
		}

		// create token
		const token = createToken(user.id);
		// todo add a cookie
		res.status(200).json({ success: true, message: "logged-in successfully", token, email });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

// signup user
export const signupUser = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await signup(User, email, password);
		// create token
		const token = createToken(user._id);
		res.status(200).json({ success: true, message: "signed up successfully", token, email });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};
