import express from "express";
import { loginUser, signupUser, getAllUsers, getUser, followUser, unFollowUser, getUserFollowers, getUserFollowing } from "../controllers/user";
import auth from "../middleware/auth";

export const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.get("/:id", getUser);
router.get("/:id/followers", getUserFollowers);
router.get("/:id/following", getUserFollowing);

router.use(auth); // protect below routes

router.get("/", getAllUsers);
router.get("/:id/follow/:user", followUser);
router.get("/:id/unfollow/:user", unFollowUser);

// todo: likes
// router.get("/:id/like/:article", likeArticle);
// router.get("/:id/unlike/:article", unLikeArticle);
