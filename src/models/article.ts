import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema(
	{
		title: { type: String },
		thumbnail: { type: String },
		content: { type: String },
		ownedBy: { type: Schema.Types.ObjectId, ref: "User" },
		likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
		// readTime: { type: String }, // todo: handle it later
	},
	{ timestamps: true }
);

export default mongoose.model("Article", userSchema);
