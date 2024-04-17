import express from "express";
import {
	loginUser,
	signupUser,
	checkUsernameAvailability,
	getAllUsers,
	getUser,
	followUser,
	unFollowUser,
	getUserFollowers,
	getUserFollowing,
	updateEmail,
	updatePassword,
	updateUsername,
} from "../controllers/user";
import auth from "../middleware/auth";

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.get("/:id", getUser);
router.get("/username/:username", checkUsernameAvailability);
router.get("/:id/followers", getUserFollowers);
router.get("/:id/following", getUserFollowing);

router.use(auth); // protect below routes

router.get("/", getAllUsers);
router.get("/:id/follow/:user", followUser);
router.get("/:id/unfollow/:user", unFollowUser);

// change user info
router.put("/email", updateEmail);
router.put("/username", updateUsername);
router.put("/password", updatePassword);

export default router;
