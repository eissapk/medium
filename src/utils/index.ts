import jwt from "jsonwebtoken";
const { JWT_SECRET, JWT_EXPIRATION } = process.env;

export const validator = {
	isEmail(str: string): boolean {
		// return /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(str);
		return str.includes("@");
	},
	isStrongPassword(str: string): boolean {
		// return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/.test(str); // todo fix regex
		// return str.length >= 6 && /[a-z]/.test(str) && /[A-Z]/.test(str) && /~|!|@|#|$|%|^|&|\*|(|)|_/.test(str) && /\d/.test(str);
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
