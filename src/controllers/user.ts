import User from "../models/user";
import { signup, login, createToken } from "../utils";

// login user
export const loginUser = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await login(User, email, password);
		// create token
		const token = createToken(user._id);
		res.status(200).json({ success: true, msg: "logged-in successfully", token, email });
	} catch (err) {
		res.status(400).json({ error: true, msg: err.message });
	}
};

// signup user
export const signupUser = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await signup(User, email, password);
		// create token
		const token = createToken(user._id);
		res.status(200).json({ success: true, msg: "signed up successfully", token, email });
	} catch (err) {
		res.status(400).json({ error: true, msg: err.message });
	}
};
