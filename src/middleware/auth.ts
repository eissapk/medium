import jwt from "jsonwebtoken";
import User from "../models/user";
const { JWT_SECRET } = process.env;

const auth = async (req, res, next) => {
	// console.log("verify token");
	const { authorization } = req.headers; // e.g. Bearer dfklsdjfkls5465
	// console.log({ authorization });

	if (!authorization) {
		return res.status(401).json({ error: true, msg: "Unauthorized: No token provided" });
	}

	const token = authorization.split(" ")[1];

	try {
		// validate signature, because the payload maybe changed (malformed) (if the payload (data) it's changed then the signature validation will fail)
		const { _id } = jwt.verify(token, JWT_SECRET); // verify the token with the secret
		req.user = await User.findById(_id); // check if the user exists by the id and bind it to the request
		// console.log("verified user successfully:", req.user);
		next();
	} catch (err) {
		return res.status(401).json({ error: true, msg: "Request is not authorized" });
	}
};

export default auth;
