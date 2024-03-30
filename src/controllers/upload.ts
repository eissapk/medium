import fs from "fs";
import path from "path";
const isFirebase = false;
// todo: upload to firebase storage, (because each deploy here will wipe out user asstes)
export const uploadByFile = async (req, res) => {
	try {
		if (!isFirebase) {
			const file = req.files[0];
			// console.log("file:", file);
			if (file.size > 1 * 1024 * 1024) return res.status(400).json({ error: true, message: "File size is greater than 1MB" });

			const b64 = Buffer.from(file.buffer).toString("base64");
			// const url = `data:${file.mimetype};base64,${b64}`;
			const data = `${b64}`;
			const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

			if (!fs.existsSync(path.resolve(__dirname, "../uploads/" + req.user._id))) fs.mkdirSync(path.resolve(__dirname, "../uploads/" + req.user._id));
			fs.writeFileSync(path.resolve(__dirname, `../uploads/${req.user._id}/${uniqueSuffix + "-" + file.originalname}`), data, "base64");

			// the valid response regarding image tool plugin of @editorjs is { success: 1, file: { url: "" } }
			res.status(200).json({ success: 1, message: "uploaded by file", file: { url: `/api/uploads/${req.user._id}/${uniqueSuffix + "-" + file.originalname}` } });
		}
	} catch (error) {
		res.status(400).json({ error: true, message: error.message });
	}
};

export const uploadByUrl = (req, res) => {
	console.log("upload file", req.files);
	console.log("upload body", req.body);
	res.status(200).json({ success: true, message: "uploaded by url" });
};
