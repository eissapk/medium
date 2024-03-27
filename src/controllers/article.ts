import Article from "../models/article";
import User from "../models/user";
import mongoose from "mongoose";

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

export const getArticles = async (req, res) => {
	try {
		const articles = await Article.find({}).sort({ createdAt: -1 }); // todo: add limit
		res.status(200).json({ success: true, data: articles || [] });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

export const getUserArticles = async (req, res) => {
	const { id: userId } = req.params;
	if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(404).json({ error: true, message: "User doesn't exist!" });

	try {
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: true, message: "User doesn't exist!" });

		const articles = await Article.find({ _id: { $in: user.articles } }).sort({ createdAt: -1 }); // todo: add limit
		res.status(200).json({ success: true, data: articles || [] });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

export const getUserFeeds = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ error: true, message: "User doesn't exist!" });

	try {
		const user = await User.findById(id);
		if (!user) return res.status(404).json({ error: true, message: "User doesn't exist!" });

		const articles = await Article.find({ ownedBy: { $in: user.following } }).sort({ createdAt: -1 }); // todo: add limit
		const users = await User.find({ _id: { $in: user.following } });

		// bind user info to his own articles
		const modifiedArticles = articles.map((articleItem: any) => {
			const matchedUser = users.find(userItem => userItem._id.toString() == articleItem.ownedBy.toString());
			if (matchedUser) return { ...articleItem.toJSON(), user: matchedUser };
			return articleItem;
		});

		res.status(200).json({ success: true, data: modifiedArticles });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

export const createArticle = async (req, res) => {
	const { title, thumbnail = null, content, readTime } = req.body;
	if (!title || !content || !readTime) return res.status(400).json({ error: true, message: "One or these fields are missing: title, content, readTime" });

	const ownedBy = req.user._id.toString(); // binded to req by default via auth module
	const slug = title
		.replace(/[&\\/\\#,+()$~%.'":*?<>{}]/g, "")
		.split(" ")
		.join("-")
		.toLowerCase(); // todo: test arabic chars with تشكيل

	try {
		// bind article to collection
		const article = await Article.create({ title, slug, thumbnail, content, ownedBy, readTime, likes: [] });

		// bind article id to current User
		const user = await User.findById(ownedBy);
		const userArticles = user?.articles || [];
		// if (!userArticles.includes(article.id.toString())) { // optional (as each article has unique id)
		await User.findOneAndUpdate({ _id: ownedBy }, { articles: userArticles.concat(article.id.toString()) });
		// }

		res.status(200).json({ success: true, data: article });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

export const removeArticle = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id) || !id) return res.status(404).json({ error: true, message: "Article doesn't exist!" });
	try {
		const article = await Article.findById(id);
		if (!article) return res.status(404).json({ error: true, message: "Article doesn't exist!" });

		// check if the article is owned by current User
		if (!req.user.articles.find(item => item.toString() == id)) {
			return res.status(401).json({ error: true, message: "Unauthorized User!" });
		}

		await Article.findByIdAndDelete(id);

		// remove article from current User
		const user = await User.findById(req.user._id);
		const userArticles = user?.articles || [];
		await User.findOneAndUpdate({ _id: req.user._id }, { articles: userArticles.filter(item => item._id.toString() != id) });

		res.status(200).json({ success: true, data: article });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

export const updateArticle = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id) || !id) return res.status(404).json({ error: true, message: "Article doesn't exist!" });

	const { title, thumbnail, content } = req.body;
	if (!title && !thumbnail && !content) return res.status(400).json({ error: true, message: "A property is missing!" });

	try {
		const exists = await Article.findById(id);
		if (!exists) return res.status(404).json({ error: true, message: "Article doesn't exist!" });

		// check if the article is owned by current User
		if (!req.user.articles.find(item => item.toString() == id)) {
			return res.status(401).json({ error: true, message: "Unauthorized User!" });
		}

		const article = await Article.findOneAndUpdate({ _id: id }, { ...req.body });
		if (!article) return res.status(404).json({ error: true, message: "Article doesn't exist!" });

		res.status(200).json({ success: true, data: article });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};
