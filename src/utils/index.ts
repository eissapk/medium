import jwt from "jsonwebtoken";
import path from "path";
const { JWT_SECRET, JWT_EXPIRATION } = process.env;

export const validator = {
	isEmail(str: string): boolean {
		// return /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(str);
		return str.includes("@");
	},
	passwordHint: "Password is not strong enough,<br/>use capital and small letters + digits<br/>minimum is 6 characters",
	isStrongPassword(str: string): boolean {
		// return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(str); // for production
		return str.length >= 6;
	},
};
export const createToken = (_id: string) => {
	return jwt.sign({ _id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};
export function logger(req, res, next) {
	console.log(req.path, req.method);
	next();
}

export const expiresIn = (period: number) => {
	return new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * period);
};

export const multerConfig = {
	storage: {
		destination: (req, file, cb) => cb(null, path.resolve(__dirname, "../uploads")),
		filename: (req, file, cb) => {
			const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
			cb(null, uniqueSuffix + "-" + file.originalname);
		},
	},
	fileFilter: (req, file, cb) => {
		if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
			cb(null, true);
		} else {
			cb(null, false);
		}
	},
	limits: { fileSize: 1024 * 1024 * 2 },
};
