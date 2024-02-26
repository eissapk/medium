import mongoose from "mongoose";
const { MONGO_URI = "" } = process.env;

export const connectDB = async () => {
	try {
		await mongoose.connect(MONGO_URI);
		console.log("Connected to DB.");
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};
