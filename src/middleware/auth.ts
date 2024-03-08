import jwt from "jsonwebtoken";
import User from "../models/user";
const { JWT_SECRET } = process.env;

const auth = async (req, res, next) => {
	// console.log("verify token");

	console.log("cookie:", req.cookies);

	if (!req.cookies || !req.cookies.token) {
		return res.status(401).clearCookie("token").clearCookie("email").clearCookie("userId").json({ error: true, message: "Unauthorized: No token provided" });
	}

	try {
		// validate signature, because the payload maybe changed (malformed) (if the payload (data) it's changed then the signature validation will fail)
		const { _id } = jwt.verify(req.cookies.token, JWT_SECRET); // verify the token with the secret
		req.user = await User.findById(_id); // check if the user exists by the id and bind it to the request
		// console.log("verified user successfully:", req.user);
		next();
	} catch (err) {
		return res.status(401).clearCookie("token").clearCookie("email").clearCookie("userId").json({ error: true, message: "Request is not authorized" });
	}
};

export default auth;
