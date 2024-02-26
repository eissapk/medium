import express from "express";
import { getAllArticles, getArticle, addArticle } from "../controllers/article";

export const router = express.Router();

router.get("/", getAllArticles);
router.get("/:id", getArticle);
router.post("/add", addArticle);
