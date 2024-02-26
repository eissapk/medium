import User from "../models/user";
import bcrypt from "bcryptjs";
import { createToken, validator } from "../utils";
import mongoose from "mongoose";

// todo: add brute force attack protection , e.g. counter of failed login max 3 times and then block the user and force him to change password
export const loginUser = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) return res.status(400).json({ error: true, message: "Password or Email is not present!" });

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ error: true, message: "Invalid login credentials" });
		}

		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res.status(400).json({ error: true, message: "Invalid login credentials" });
		}

		const token = createToken(user.id);
		// todo add a cookie
		res.status(200).json({ success: true, message: "logged-in successfuly", token, email });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

export const signupUser = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) return res.status(400).json({ error: true, message: "Password or Email is not present!" });

	if (!validator.isEmail(email)) {
		return res.status(400).json({ error: true, message: "Email is not valid" });
	}
	if (!validator.isStrongPassword(password)) {
		return res.status(400).json({ error: true, message: "Password is not strong enough, Capital and small letters + number + special chars, min = 6 chars" });
	}

	try {
		const exists = await User.findOne({ email });
		if (exists) return res.status(400).json({ error: true, message: "Email already in use!" });

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);
		const user = await User.create({ email, password: hash });
		const token = createToken(user.id);

		// todo add a cookie
		res.status(200).json({ success: true, message: "signed up successfuly", token, email });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};
export const getAllUsers = async (req, res) => {
	try {
		const users = await User.find({}); // todo: add limit or query by range e.g. start, end
		res.status(200).json({ success: true, data: users });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

export const getUser = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ error: true, message: "User doesn't exist!" });

	try {
		const user = await User.findById(id);
		if (!user) return res.status(404).json({ error: true, message: "User doesn't exist!" });
		res.status(200).json({ success: true, data: user });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};
