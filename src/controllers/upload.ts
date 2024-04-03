import fs from "fs";
import path from "path";
import { getStorage, ref, uploadBytes } from "firebase/storage";
const isFirebase = false;
// list all files as array of {"items": [{"name": ""}]}
const baseURl = "https://firebasestorage.googleapis.com/v0/b/meedium-clone.appspot.com/o/";

export const uploadByFile = async (req, res) => {
	try {
		const file = req.files[0];
		console.log("file:", file);
		if (file.size > 1 * 1024 * 1024) return res.status(400).json({ error: true, message: "File size is greater than 1MB" });

		const b64 = Buffer.from(file.buffer).toString("base64");
		// const url = `data:${file.mimetype};base64,${b64}`;
		const data = `${b64}`;
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

		if (!isFirebase) {
			if (!fs.existsSync(path.resolve(__dirname, "../uploads/" + req.user._id))) fs.mkdirSync(path.resolve(__dirname, "../uploads/" + req.user._id));
			fs.writeFileSync(path.resolve(__dirname, `../uploads/${req.user._id}/${uniqueSuffix + "-" + file.originalname}`), data, "base64");
			// the valid response regarding image tool plugin of @editorjs is { success: 1, file: { url: "" } }
			return res.status(200).json({ success: 1, message: `Uploaded ${file.originalname}`, file: { url: `/api/uploads/${req.user._id}/${uniqueSuffix + "-" + file.originalname}` } });
		}

		const filePath = `${req.user._id}/${uniqueSuffix + "-" + file.originalname}`;
		console.log("filepath:", filePath);

		const storage = getStorage();
		const imagesRef = ref(storage, "images/" + filePath);

		// todo: check why uploaded file is always 9bytes
		uploadBytes(imagesRef, file, { contentType: file.mimetype }).then(snapshot => {
			console.log("snapshot:\n", snapshot);
			return res.status(200).json({ success: 1, message: "uploaded by file", file: { url: baseURl + snapshot.metadata.fullPath } });
		});
	} catch (error) {
		res.status(400).json({ error: true, message: error.message });
	}
};

export const uploadByUrl = (req, res) => {
	console.log("upload file", req.files);
	console.log("upload body", req.body);
	res.status(200).json({ success: true, message: "uploaded by url" });
};
