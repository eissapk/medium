import express from "express";
import { loginUser, signupUser, getAllUsers, getUser, followUser, unFollowUser, getUserFollowers, getUserFollowing } from "../controllers/user";
import auth from "../middleware/auth";

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.get("/:id", getUser);
// router.get("/:username", getUser); // todo: add query by username beside id
router.get("/:id/followers", getUserFollowers);
router.get("/:id/following", getUserFollowing);

router.use(auth); // protect below routes

router.get("/", getAllUsers);
router.get("/:id/follow/:user", followUser);
router.get("/:id/unfollow/:user", unFollowUser);

export default router;
