import Article from "../models/article";
import User from "../models/user";
import mongoose from "mongoose";

export const getArticle = async (req, res) => {
	const { id } = req.params;
	let article: any = null;

	try {
		if (mongoose.Types.ObjectId.isValid(id)) article = await Article.findById(id);
		else article = await Article.findOne({ slug: id });

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
	let user: any = null;

	try {
		if (mongoose.Types.ObjectId.isValid(userId)) user = await User.findById(userId);
		else user = await User.findOne({ username: userId });

		if (!user) return res.status(404).json({ error: true, message: "User doesn't exist!" });

		const articles = await Article.find({ _id: { $in: user.articles } }).sort({ createdAt: -1 }); // todo: add limit
		res.status(200).json({ success: true, data: articles || [] });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

export const getUserFeeds = async (req, res) => {
	const { id } = req.params;
	let user: any = null;

	try {
		if (mongoose.Types.ObjectId.isValid(id)) user = await User.findById(id);
		else user = await User.findOne({ username: id });

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

// todo: test this
export const removeArticle = async (req, res) => {
	const { id } = req.params;
	let article: any = null;
	try {
		if (mongoose.Types.ObjectId.isValid(id)) article = await Article.findById(id);
		else article = await Article.findOne({ slug: id });

		if (!article) return res.status(404).json({ error: true, message: "Article doesn't exist!" });

		// check if the article is owned by current User
		if (!req.user.articles.find(item => item.toString() == article._id)) {
			return res.status(401).json({ error: true, message: "Unauthorized User!" });
		}

		// remove from article colletion
		await Article.findByIdAndDelete(article._id);

		// remove article from (current) User collection
		const user = await User.findById(req.user._id);
		const userArticles = user?.articles || [];
		// todo: check alternative method to findOneAndUpdateById
		await User.findOneAndUpdate({ _id: req.user._id }, { articles: userArticles.filter(item => item.toString() != article._id) });

		res.status(200).json({ success: true, data: article });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

export const updateArticle = async (req, res) => {
	const { id } = req.params;
	let article: any = null;

	const { title, thumbnail, content } = req.body;
	if (!title && !thumbnail && !content) return res.status(400).json({ error: true, message: "A property is missing!" });

	try {
		if (mongoose.Types.ObjectId.isValid(id)) article = await Article.findById(id);
		else article = await Article.findOne({ slug: id });

		if (!article) return res.status(404).json({ error: true, message: "Article doesn't exist!" });

		// check if the article is owned by authenticated User
		if (!req.user.articles.find(item => item.toString() == article._id.toString())) {
			return res.status(401).json({ error: true, message: "Unauthorized User!" });
		}

		// todo: check alternative method to findOneAndUpdateById
		await Article.findOneAndUpdate({ _id: article._id }, { ...req.body });

		res.status(200).json({ success: true, data: article });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

export const likeArticle = async (req, res) => {
	const { articleId, userId } = req.params;
	if (!userId || !articleId) return res.status(400).json({ error: true, message: "User id or article id are missing!" });

	try {
		const article = await Article.findById(articleId);
		if (!article) return res.status(404).json({ error: true, message: "Article doesn't exist!" });

		// Article is being liked by this user already! -- unlike then
		if (article.likes.includes(userId)) return unLikeArticle(articleId, userId, res);

		const newLikes = [...article.likes, userId];
		await Article.findOneAndUpdate({ _id: articleId }, { likes: newLikes });

		res.status(200).json({ success: true, message: `User ${userId} liked Article ${articleId}`, data: { ...article?.toJSON(), likes: newLikes } });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};

const unLikeArticle = async (articleId, userId, res) => {
	try {
		const article = await Article.findById(articleId);

		const newLikes = article?.likes.filter(id => id != userId);

		await Article.findOneAndUpdate({ _id: articleId }, { likes: newLikes });

		res.status(200).json({ success: true, message: `User ${userId} Unliked Article ${articleId}`, data: { ...article?.toJSON(), likes: newLikes } });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};
