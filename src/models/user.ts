import { model, Schema } from "mongoose";
const userSchema = new Schema(
	{
		email: { type: String, required: true, unique: true },
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		avatar: { type: String, default: null },
		name: { type: String, default: null },
		title: { type: String, default: null },
		bio: { type: String, default: null },
		socialLinks: [{ provider: { type: String }, url: { type: String } }],
		articles: [{ type: Schema.Types.ObjectId, ref: "Article" }],
		followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
		following: [{ type: Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true }
);

userSchema.index({ username: 1, name: 1, email: 1 }); // for binary search | effecient for large database -- comment this line if your database is small

export default model("User", userSchema);
