import { Schema, model } from "mongoose";
const userSchema = new Schema(
	{
		title: { type: String, required: true },
		slug: { type: String, required: true },
		thumbnail: { type: String },
		content: { type: Array, required: true },
		ownedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
		likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
		comments: [
			{
				ownedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
				content: { type: String, required: true },
				likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
			},
		],
		readTime: { type: Number, required: true },
	},
	{ timestamps: true }
);

userSchema.index({ title: 1, slug: 1 }); // for binary search | effecient for large database -- comment this line if your database is small

export default model("Article", userSchema);
