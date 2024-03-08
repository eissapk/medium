import User from "../models/user";
import bcrypt from "bcryptjs";
import { createToken, expiresIn, validator } from "../utils";
import mongoose from "mongoose";

const cookieConfig = ({ days = 30, httpOnly = false }: { days?: number; httpOnly?: boolean }) => {
	return {
		sameSite: "strict",
		path: "/",
		expires: expiresIn(days),
		httpOnly,
		secure: true, // cookie created only on https protocols
	};
};

export const loginUser = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) return res.status(400).json({ error: true, message: "Password or Email is not present!" });

	try {
		const user = await User.findOne({ email });
		if (!user) {
			// todo: add brute force attack protection , e.g. counter of failed login max 3 times and then block the user and force him to change password
			return res.status(400).json({ error: true, message: "Invalid login credentials" });
		}

		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res.status(400).json({ error: true, message: "Invalid login credentials" });
		}

		const token = createToken(user.id);
		// todo add a cookie

		res
			.status(200)
			.cookie("token", token, cookieConfig({ httpOnly: true }))
			.cookie("email", email, cookieConfig({}))
			.cookie("userId", user._id, cookieConfig({}))
			.json({
				success: true,
				message: "logged-in successfuly",
				data: {
					user: {
						email,
						_id: user._id,
						avatar: user.avatar,
						name: user.name,
						title: user.title,
						bio: user.bio,
						socialLinks: user.socialLinks,
						articles: user.articles.length,
						followers: user.followers.length,
						following: user.following.length,
						createdAt: user.createdAt,
					},
				},
			});
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

		res
			.status(200)
			.cookie("token", token, cookieConfig({ httpOnly: true }))
			.cookie("email", email, cookieConfig({}))
			.cookie("userId", user._id, cookieConfig({}))
			.json({
				success: true,
				message: "signed up successfuly",
				data: {
					user: {
						email,
						_id: user._id,
						avatar: user.avatar,
						name: user.name,
						title: user.title,
						bio: user.bio,
						socialLinks: user.socialLinks,
						articles: user.articles.length,
						followers: user.followers.length,
						following: user.following.length,
						createdAt: user.createdAt,
					},
				},
			});
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};
export const getAllUsers = async (req, res) => {
	// const { start, end } = req.body; // todo
	try {
		const users = await User.find({});
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

export const followUser = async (req, res) => {
	const { id: currentUserId, user: foreignUserId } = req.params;
	if (!mongoose.Types.ObjectId.isValid(currentUserId)) return res.status(404).json({ error: true, message: "User doesn't exist!" });
	if (!mongoose.Types.ObjectId.isValid(foreignUserId)) return res.status(404).json({ error: true, message: "Foreign User doesn't exist!" });

	try {
		const currentUser = await User.findById(currentUserId);
		if (!currentUser) return res.status(404).json({ error: true, message: "User doesn't exist!" });

		const foreignUser = await User.findById(foreignUserId);
		if (!foreignUser) return res.status(404).json({ error: true, message: "Foreign User doesn't exist!" });

		// check if current user is already following foreign user
		if (currentUser.following.includes(foreignUserId)) return res.status(200).json({ success: true, message: "user is being followed already!" });

		// add to following
		await User.findOneAndUpdate({ _id: currentUserId }, { following: [...currentUser.following, foreignUserId] });

		// add to followers
		await User.findOneAndUpdate({ _id: foreignUserId }, { followers: [...foreignUser.followers, currentUserId] });

		res.status(200).json({ success: true, message: `User: ${currentUserId}, followed: ${foreignUserId}` });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

export const unFollowUser = async (req, res) => {
	const { id: currentUserId, user: foreignUserId } = req.params;
	if (!mongoose.Types.ObjectId.isValid(currentUserId)) return res.status(404).json({ error: true, message: "User doesn't exist!" });
	if (!mongoose.Types.ObjectId.isValid(foreignUserId)) return res.status(404).json({ error: true, message: "Foreign User doesn't exist!" });

	try {
		const currentUser = await User.findById(currentUserId);
		if (!currentUser) return res.status(404).json({ error: true, message: "User doesn't exist!" });

		const foreignUser = await User.findById(foreignUserId);
		if (!foreignUser) return res.status(404).json({ error: true, message: "Foreign User doesn't exist!" });

		// check if current user is already following foreign user
		if (!currentUser.following.includes(foreignUserId)) return res.status(200).json({ success: true, message: "user is not being followed already!" });

		// remove from following
		await User.findOneAndUpdate({ _id: currentUserId }, { following: currentUser.following.filter(item => item.toString() != foreignUserId.toString()) });

		// remove from followers
		await User.findOneAndUpdate({ _id: foreignUserId }, { followers: foreignUser.followers.filter(item => item.toString() != currentUserId.toString()) });

		res.status(200).json({ success: true, message: `User: ${currentUserId}, unfollowed: ${foreignUserId}` });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};
