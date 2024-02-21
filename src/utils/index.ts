import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const validator = {
	isEmail(str: string): boolean {
		// return /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(str);
		return str.includes("@");
	},
	isStrongPassword(str: string): boolean {
		// return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/.test(str); // todo fix regex
		return str.length >= 6 && /[a-z]/.test(str) && /[A-Z]/.test(str) && /~|!|@|#|$|%|^|&|\*|(|)|_/.test(str) && /\d/.test(str);
	},
};

export async function signup(User, email: string, password: string) {
	if (!email || !password) {
		throw new Error("All fields must be filled");
	}

	if (!validator.isEmail(email)) {
		throw new Error("Email is not valid");
	}
	if (!validator.isStrongPassword(password)) {
		throw new Error("Password is not strong enough, (e.g. Capital and small letters + number + special chars), min = 6 chars");
	}

	const exists = await User.findOne({ email });
	if (exists) throw new Error("Email aleady in use");

	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt); // hash password (using salt by 10)
	const user = await User.create({ email, password: hash }); // store password as hash in db
	return user;
}

export async function login(User, email: string, password: string) {
	if (!email || !password) {
		throw new Error("All fields must be filled");
	}

	const userExists = await User.findOne({ email });
	if (!userExists) throw new Error("Invalid login credentials"); // don't specify the real reason because of hackers
	const match = await bcrypt.compare(password, userExists.password); // compare plain password with hashed one
	if (!match) throw new Error("Invalid login credentials");
	return userExists;
}

export const createToken = (_id: string) => {
	return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" });
};
