import Article from "../models/Article";
import mongoose from "mongoose";

export const getAllArticles = async (req, res) => {
	try {
		const articles = await Article.find({});
		res.status(200).json({ success: true, data: articles });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

export const getArticle = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ error: true, message: "Article doesn't exist!" });

	try {
		const article = await Article.findById(id);
		if (!article) return res.status(404).json({ error: true, message: "Article doesn't exist!" });
		res.status(200).json({ success: true, data: article });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

export const addArticle = async (req, res) => {
	// title: { type: String, default: null },
	// thumbnail: { type: String, default: null },
	// content: { type: String, default: null },
	// ownedBy: { type: Schema.Types.ObjectId, ref: "User" },
	// likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
};
