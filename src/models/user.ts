import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		avatar: { type: String, default: null },
		name: { type: String, default: null },
		title: { type: String, default: null },
		bio: { type: String, default: null },
		socialLinks: [String],
		articles: [{ type: Schema.Types.ObjectId, ref: "Article" }],
	},
	{ timestamps: true }
);

export default mongoose.model("User", userSchema);
