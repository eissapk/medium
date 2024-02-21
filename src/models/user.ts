import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	name: { type: String },
	title: { type: String },
	bio: { type: String },
	socialLinks: { type: Array },
});

export default mongoose.model("User", userSchema);
