import Article from "../models/article";
import User from "../models/user";
import mongoose from "mongoose";
import { slugify } from "../utils";

export const getArticle = async (req, res) => {
	// hint: if we quey by slug then we must check for the ownedBy also
	const { articleId, userId } = req.params;
	let article: any = null;

	try {
		if (mongoose.Types.ObjectId.isValid(articleId)) article = await Article.findById(articleId);
		// check by slug for a related user!!!!!
		else {
			if (!userId) return res.status(400).json({ error: true, message: "UserId/username is not present!" });

			if (mongoose.Types.ObjectId.isValid(userId)) article = await Article.findOne({ slug: articleId, ownedBy: userId });
			else {
				// means it's a usename not id -- so we need to fetch that user to get its id to query the final article by (slug and ownedBy)
				const selectedUser = await User.findOne({ username: userId });
				if (!selectedUser) return res.status(400).json({ error: true, message: "User doesn't exist!" });
				article = await Article.findOne({ slug: articleId, ownedBy: selectedUser.id });
			}
		}

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
	const slug = slugify(title);

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
	const { articleId, userId } = req.params;
	let article: any = null;
	try {
		if (mongoose.Types.ObjectId.isValid(articleId)) article = await Article.findById(articleId);
		// check by slug for a related user!!!!!
		else {
			if (!userId) return res.status(400).json({ error: true, message: "UserId/username is not present!" });

			if (mongoose.Types.ObjectId.isValid(userId)) article = await Article.findOne({ slug: articleId, ownedBy: userId });
			else {
				// means it's a usename not id -- so we need to fetch that user to get its id to query the final article by (slug and ownedBy)
				const selectedUser = await User.findOne({ username: userId });
				if (!selectedUser) return res.status(400).json({ error: true, message: "User doesn't exist!" });
				article = await Article.findOne({ slug: articleId, ownedBy: selectedUser.id });
			}
		}

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
	const { articleId, userId } = req.params;
	let article: any = null;

	const { title, thumbnail = null, content, readTime } = req.body;
	if (!title || !content || !readTime) return res.status(400).json({ error: true, message: "One or these fields are missing: title, content, readTime" });

	const slug = slugify(title);

	try {
		if (mongoose.Types.ObjectId.isValid(articleId)) article = await Article.findById(articleId);
		// check by slug for a related user!!!!!
		else {
			if (!userId) return res.status(400).json({ error: true, message: "UserId/username is not present!" });

			if (mongoose.Types.ObjectId.isValid(userId)) article = await Article.findOne({ slug: articleId, ownedBy: userId });
			else {
				// means it's a usename not id -- so we need to fetch that user to get its id to query the final article by (slug and ownedBy)
				const selectedUser = await User.findOne({ username: userId });
				if (!selectedUser) return res.status(400).json({ error: true, message: "User doesn't exist!" });
				article = await Article.findOne({ slug: articleId, ownedBy: selectedUser.id });
			}
		}

		if (!article) return res.status(404).json({ error: true, message: "Article doesn't exist!" });

		// check if the article is owned by authenticated User
		if (!req.user.articles.find(item => item.toString() == article._id.toString())) {
			return res.status(401).json({ error: true, message: "Unauthorized User!" });
		}

		// todo: check alternative method to findOneAndUpdateById
		await Article.findOneAndUpdate({ _id: article._id }, { title, slug, thumbnail, content, readTime });

		res.status(200).json({ success: true, data: { ...article.toJSON(), title, slug, thumbnail, content, readTime } });
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

// critiria: get trending articles (last n days and has highest likes and comments) [must have likes and comments]
export const getTrendingArticles = async (req, res) => {
	const max = 6;
	const startDate = (days: number) => new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000);

	try {
		const trendingArticles: object[] = [];

		// $gte: greater than or equal
		let articles = await Article.find({ createdAt: { $gte: startDate(7) } }); // this means get all articles created from last no. of ${days} till now
		if (!articles.length) articles = await Article.find({ createdAt: { $gte: startDate(14) } });
		if (!articles.length) articles = await Article.find({ createdAt: { $gte: startDate(21) } });
		if (!articles.length) articles = await Article.find({ createdAt: { $gte: startDate(28) } });
		if (!articles.length) articles = await Article.find({});
		if (!articles.length) return res.status(404).json({ error: true, message: "No trending articles found!" });

		// todo: find out how to query articles from mongo that have likes and comments only and delete this line (e.g. likes.length && comments.length)
		// filter out articles that have likes and comments only
		// articles = articles.filter(article => article.likes.length && article.comments.length); // use it later when comments functionality is ready
		articles = articles.filter(article => article.likes.length);

		if (!articles.length) return res.status(404).json({ error: true, message: "No trending articles found!" });

		// highest likes
		const highestLikes = articles.sort((a, b) => b.likes.length - a.likes.length).slice(0, max);

		// highest comments
		const highestComments = articles.sort((a, b) => b.comments.length - a.comments.length).slice(0, max);

		// unify the highest likes and highest comments in one array
		const mergedCounts: any[] = [];
		highestLikes.forEach(item => mergedCounts.push({ count: item.likes.length, _id: item._id }));
		highestComments.forEach(item => mergedCounts.push({ count: item.comments.length, _id: item._id }));
		const filteredCounts = mergedCounts.sort((a, b) => b.count - a.count).slice(0, max);

		const finalTrendingArticles = articles.filter(item => {
			if (filteredCounts.find(count => count._id.toString() == item._id.toString())) return item;
		});

		// get article owners
		const usersIds = finalTrendingArticles.map(article => article.ownedBy);
		const users = await User.find({ _id: { $in: usersIds } });

		//  bind users to articles
		finalTrendingArticles.forEach(article => {
			users.find(user => {
				if (article.ownedBy.toString() == user._id.toString()) trendingArticles.push({ article, user });
			});
		});

		res.status(200).json({ success: true, data: trendingArticles });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};
