import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema(
	{
		title: { type: String, default: null },
		thumbnail: { type: String, default: null },
		content: { type: String, default: null },
		ownedBy: { type: Schema.Types.ObjectId, ref: "User" },
		likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true }
);

export default mongoose.model("Article", userSchema);
