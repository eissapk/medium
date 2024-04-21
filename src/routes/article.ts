import express from "express";
import { createArticle, getArticles, getUserArticles, getUserFeeds, updateArticle, removeArticle, getArticle, likeArticle, getTrendingArticles } from "../controllers/article";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/:articleId/of/:userId", getArticle); // you can ignore :userId and pass article id only like so: /api/article/:articleId/of/dummyString -- the same concept is used for other below routes with /of/
router.get("/user/:id", getUserArticles); // /api/article/user/:id
router.get("/trending", getTrendingArticles);

router.use(auth); // protect below routes

router.get("/feeds/user/:id", getUserFeeds); // /api/article/feeds/user/:id
router.get("/", getArticles);
router.post("/create", createArticle);
router.delete("/:articleId/of/:userId", removeArticle);
router.put("/:articleId/of/:userId", updateArticle);
router.get("/:articleId/likedby/:userId", likeArticle);

export default router;
