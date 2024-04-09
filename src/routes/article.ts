import express from "express";
import { createArticle, getArticles, getUserArticles, getUserFeeds, updateArticle, removeArticle, getArticle, likeArticle } from "../controllers/article";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/:articleId/of/:userId", getArticle);
router.get("/user/:id", getUserArticles); // /api/article/user/:id

router.use(auth); // protect below routes

router.get("/feeds/user/:id", getUserFeeds); // /api/article/feeds/user/:id
router.get("/", getArticles);
router.post("/create", createArticle);
router.delete("/:articleId/of/:userId", removeArticle);
router.put("/:articleId/of/:userId", updateArticle);
router.get("/:articleId/likedby/:userId", likeArticle);

export default router;
