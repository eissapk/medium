import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema(
	{
		title: { type: String, required: true },
		slug: { type: String, required: true },
		thumbnail: { type: String },
		content: { type: String, required: true },
		ownedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
		likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
		readTime: { type: Number, required: true },
	},
	{ timestamps: true }
);

export default mongoose.model("Article", userSchema);
