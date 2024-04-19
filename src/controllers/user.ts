import User from "../models/user";
import bcrypt from "bcryptjs";
import { createToken, expiresIn, uploadBinaryFile, validator } from "../utils";
import mongoose from "mongoose";
// todo: try using distinct("email") if you want just values

// issue: cookies can't be shared between two different domains, (that's by cookies default design), so i have to serve the frontend from backend to use only one domain0
const cookieConfig = ({ days = 30, httpOnly = false }: { days?: number; httpOnly?: boolean }) => {
	return {
		sameSite: "strict",
		path: "/",
		expires: expiresIn(days),
		httpOnly,
		secure: true, // cookie created only on https protocols
	};
};

// todo make logout route/method
export const loginUser = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) return res.status(400).json({ error: true, message: "Password or Email is not present!" });

	try {
		// const foo = await User.find({ email }).explain("executionStats");
		// console.log("executionStats:", foo);
		/* if nReturned = totalDocsExamined then it means that it's a good query (indexes enabled [binary search algorithm is used]
		executionStats: {
			nReturned: 1,
			totalDocsExamined: 1
		}
		*/

		const user = await User.findOne({ email });
		if (!user) {
			// todo: add brute force attack protection , e.g. counter of failed login max 3 times and then block the user and force him to change password
			return res.status(400).json({ error: true, message: "User doesn't exist!" }); // it should be invalid login credentials for fooling hackers
		}

		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res.status(400).json({ error: true, message: "Invalid login credentials" });
		}

		const token = createToken(user.id);

		res
			.status(200)
			.cookie("token", token, cookieConfig({ httpOnly: true }))
			.cookie("email", user.email, cookieConfig({}))
			.cookie("username", user.username, cookieConfig({}))
			.cookie("userId", user._id, cookieConfig({}))
			.cookie("avatar", user.avatar, cookieConfig({}))
			.json({
				success: true,
				message: "logged-in successfuly",
				data: { user: { ...user.toJSON() } },
			});
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

export const signupUser = async (req, res) => {
	const { email, password, username } = req.body;

	if (!email) return res.status(400).json({ error: true, message: "Email is not present!" });
	if (!username) return res.status(400).json({ error: true, message: "Username is not present!" });
	if (!password) return res.status(400).json({ error: true, message: "Password is not present!" });

	if (!validator.isEmail(email)) {
		return res.status(400).json({ error: true, message: "Email is not valid" });
	}
	if (!validator.isStrongPassword(password)) return res.status(400).json({ error: true, message: validator.passwordHint });

	try {
		const emailExists = await User.findOne({ email });
		if (emailExists) return res.status(400).json({ error: true, message: "Email already in use!" });

		const usernameExists = await User.findOne({ username });
		if (usernameExists) return res.status(400).json({ error: true, message: "Username already in use!" });

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);
		const user = await User.create({ email, username, password: hash });
		await User.createIndexes(); //todo: test if it works
		const token = createToken(user.id);

		res
			.status(200)
			.cookie("token", token, cookieConfig({ httpOnly: true }))
			.cookie("email", email, cookieConfig({}))
			.cookie("username", username, cookieConfig({}))
			.cookie("userId", user._id, cookieConfig({}))
			.cookie("avatar", user.avatar, cookieConfig({}))
			.json({
				success: true,
				message: "signed up successfuly",
				data: { user: { ...user.toJSON() } },
			});
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

export const checkUsernameAvailability = async (req, res) => {
	const { username } = req.params;
	if (!username) return res.status(400).json({ error: true, message: "Username is not present!" });

	try {
		const _username = await User.findOne({ username });
		if (!_username) return res.status(200).json({ success: true, message: "username is available!", data: { taken: false } });
		return res.status(200).json({ success: true, message: "Username is taken!", data: { taken: true } });
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
	let user: any = null;

	try {
		if (mongoose.Types.ObjectId.isValid(id)) user = await User.findById(id);
		else user = await User.findOne({ username: id });

		if (!user) return res.status(404).json({ error: true, message: "User doesn't exist!" });
		res.status(200).json({ success: true, data: user });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

export const followUser = async (req, res) => {
	const { id: currentUserId, user: foreignUserId } = req.params;
	let currentUser: any = null;
	let foreignUser: any = null;

	if (currentUserId == foreignUserId) return res.status(400).json({ error: true, message: "User can't follow himself!" });

	try {
		if (mongoose.Types.ObjectId.isValid(currentUserId)) currentUser = await User.findById(currentUserId);
		else currentUser = await User.findOne({ username: currentUserId });
		if (!currentUser) return res.status(404).json({ error: true, message: "User doesn't exist!" });

		if (mongoose.Types.ObjectId.isValid(foreignUserId)) foreignUser = await User.findById(foreignUserId);
		else foreignUser = await User.findOne({ username: foreignUserId });
		if (!foreignUser) return res.status(404).json({ error: true, message: "Foreign User doesn't exist!" });

		// check if current user is already following foreign user
		if (currentUser.following.includes(foreignUser._id.toString())) return res.status(200).json({ success: true, message: "user is being followed already!" });

		// add to following
		const currentUserNewFollowingArr = [...currentUser.following, foreignUser._id];
		await User.findOneAndUpdate({ _id: currentUser._id }, { following: currentUserNewFollowingArr });

		// add to followers
		const foreignUserNewFollowersArr = [...foreignUser.followers, currentUser._id];
		await User.findOneAndUpdate({ _id: foreignUser._id }, { followers: foreignUserNewFollowersArr });

		res.status(200).json({
			success: true,
			message: `User: ${currentUserId}, followed: ${foreignUserId}`,
			data: {
				user1: {
					...currentUser.toJSON(),
					following: currentUserNewFollowingArr,
				},
				type: "follow",
				user2: {
					...foreignUser.toJSON(),
					followers: foreignUserNewFollowersArr,
				},
			},
		});
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

export const unFollowUser = async (req, res) => {
	const { id: currentUserId, user: foreignUserId } = req.params;
	let currentUser: any = null;
	let foreignUser: any = null;

	try {
		if (mongoose.Types.ObjectId.isValid(currentUserId)) currentUser = await User.findById(currentUserId);
		else currentUser = await User.findOne({ username: currentUserId });
		if (!currentUser) return res.status(404).json({ error: true, message: "User doesn't exist!" });

		if (mongoose.Types.ObjectId.isValid(foreignUserId)) foreignUser = await User.findById(foreignUserId);
		else foreignUser = await User.findOne({ username: foreignUserId });
		if (!foreignUser) return res.status(404).json({ error: true, message: "Foreign User doesn't exist!" });

		// check if current user is already following foreign user
		if (!currentUser.following.includes(foreignUser._id)) return res.status(200).json({ success: true, message: "user is not being followed already!" });

		// remove from following

		const currentUserNewFollowingArr = currentUser.following.filter(item => item.toString() != foreignUser._id.toString());
		await User.findOneAndUpdate({ _id: currentUser._id }, { following: currentUserNewFollowingArr });

		// remove from followers
		const foreignUserNewFollowersArr = foreignUser.followers.filter(item => item.toString() != currentUser._id.toString());
		await User.findOneAndUpdate({ _id: foreignUser._id }, { followers: foreignUserNewFollowersArr });

		res.status(200).json({
			success: true,
			message: `User: ${currentUserId}, unfollowed: ${foreignUserId}`,
			data: {
				user1: {
					...currentUser.toJSON(),
					following: currentUserNewFollowingArr,
				},

				type: "unfollow",
				user2: {
					...foreignUser.toJSON(),
					followers: foreignUserNewFollowersArr,
				},
			},
		});
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

export const getUserFollowers = async (req, res) => {
	const { id } = req.params;
	let user: any = null;

	try {
		if (mongoose.Types.ObjectId.isValid(id)) user = await User.findById(id);
		else user = await User.findOne({ username: id });

		if (!user) return res.status(404).json({ error: true, message: "User doesn't exist!" });

		const followers = await User.find({ _id: { $in: user.followers } }).sort({ createdAt: -1 });

		res.status(200).json({ success: true, data: followers });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

export const getUserFollowing = async (req, res) => {
	const { id } = req.params;
	let user: any = null;

	try {
		if (mongoose.Types.ObjectId.isValid(id)) user = await User.findById(id);
		else user = await User.findOne({ username: id });

		if (!user) return res.status(404).json({ error: true, message: "User doesn't exist!" });

		const following = await User.find({ _id: { $in: user.following } }).sort({ createdAt: -1 });

		res.status(200).json({ success: true, data: following });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

export const updateEmail = async (req, res) => {
	const { email: newEmail } = req.body;
	if (newEmail === req.user.email) return res.status(400).json({ error: true, message: "Email is not changed" });
	try {
		// fallback for invalid user -- alrady done in auth middleware
		const user = await User.findById(req.user._id);
		if (!user) return res.status(404).json({ error: true, message: "User doesn't exist" });

		const emailIsTaken = await User.findOne({ email: newEmail });
		if (emailIsTaken) return res.status(400).json({ error: true, message: "Email is already taken" });

		await User.findOneAndUpdate({ _id: user._id }, { email: newEmail });

		res
			.status(200)
			.cookie("email", newEmail, cookieConfig({}))
			.json({ success: true, message: "Email updated successfully!", data: { email: newEmail } });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

export const updateUsername = async (req, res) => {
	const { username: newUsername } = req.body;
	if (newUsername === req.user.username) return res.status(400).json({ error: true, message: "Username is not changed" });
	try {
		// fallback for invalid user -- alrady done in auth middleware
		const user = await User.findById(req.user._id);
		if (!user) return res.status(404).json({ error: true, message: "User doesn't exist" });

		const usernameIsTaken = await User.findOne({ username: newUsername });
		if (usernameIsTaken) return res.status(400).json({ error: true, message: "Username is already taken" });

		await User.findOneAndUpdate({ _id: user._id }, { username: newUsername });

		res
			.status(200)
			.cookie("username", newUsername, cookieConfig({}))
			.json({ success: true, message: "Username updated successfully!", data: { username: newUsername } });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

export const updatePassword = async (req, res) => {
	const { password: newPassword } = req.body;

	const match = await bcrypt.compare(newPassword, req.user.password);
	if (match) return res.status(400).json({ error: true, message: "Password is not changed" });

	try {
		// fallback for invalid user -- alrady done in auth middleware
		const user = await User.findById(req.user._id);
		if (!user) return res.status(404).json({ error: true, message: "User doesn't exist" });

		if (!validator.isStrongPassword(newPassword)) return res.status(400).json({ error: true, message: validator.passwordHint });

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(newPassword, salt);

		await User.findOneAndUpdate({ _id: user._id }, { password: hash });

		res.status(200).json({ success: true, message: "Password updated successfully!" });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

export const updateInfo = async (req, res) => {
	// body has {title, name, bio}
	const hasBinaryFile = req.files.length;
	try {
		const user = await User.findById(req.user._id);
		if (!user) return res.status(404).json({ error: true, message: "User doesn't exist" });

		let response: any = null; // todo: extract type from uploadBinaryFile fucntion
		if (hasBinaryFile) {
			response = await uploadBinaryFile(req.files, user.id);
			if (response.error) return res.status(response.status).json(response);
		}

		const updatedInfo = { ...req.body };
		if (hasBinaryFile) updatedInfo.avatar = response.file.url;

		await User.findOneAndUpdate({ _id: user.id }, updatedInfo);

		if (hasBinaryFile) {
			return res.status(200).cookie("avatar", response.file.url, cookieConfig({})).json({ success: true, message: "Info updated successfully!", data: updatedInfo });
		}
		res.status(200).json({ success: true, message: "Info updated successfully!", data: updatedInfo });
	} catch (error) {
		res.status(400).json({ error: true, message: error.message });
	}
};
