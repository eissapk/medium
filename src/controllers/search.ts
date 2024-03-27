import User from "../models/user";
import Article from "../models/article";

export const search = async (req, res) => {
	const { query } = req.params;
	if (!query) return res.status(400).json({ error: true, message: "Query is required!" });

	// todo: add limit top 10 instead of slice
	try {
		const users = await User.find({ $or: [{ username: { $regex: query, $options: "i" } }, { name: { $regex: query, $options: "i" } }] });
		const articles = await Article.find({ title: { $regex: query, $options: "i" } });
		res.status(200).json({ success: true, data: { articles: articles.slice(0, 10), users: users.slice(0, 10) } });
	} catch (err) {
		res.status(400).json({ error: true, message: err.message });
	}
};
