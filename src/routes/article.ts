import express from "express";
import { createArticle, getArticles, getUserArticles, getUserFeeds, updateArticle, removeArticle, getArticle } from "../controllers/article";
import auth from "../middleware/auth";

export const router = express.Router();

router.get("/:id", getArticle);
router.get("/user/:id", getUserArticles); // /api/article/user/:id

router.use(auth); // protect below routes

router.get("/feeds/user/:id", getUserFeeds); // /api/article/feeds/user/:id
router.get("/", getArticles);
router.post("/create", createArticle);
router.delete("/remove/:id", removeArticle);
router.put("/update/:id", updateArticle);
