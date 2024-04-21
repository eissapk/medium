import { getStorage, ref, uploadString } from "firebase/storage";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
const { JWT_SECRET, JWT_EXPIRATION } = process.env;

export const validator = {
	isEmail: (str: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/g.test(str),
	// isStrongPassword: (str: string): boolean => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(str), // for production
	passwordHint: "Password is not strong enough,<br/>use capital and small letters + digits<br/>minimum is 6 characters",
	isStrongPassword: (str: string): boolean => str.length >= 6, // for development
};
export const createToken = (_id: string) => {
	return jwt.sign({ _id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};
export function logger(req, res, next) {
	console.log(req.path, req.method);
	next();
}

export const expiresIn = (period: number) => {
	return new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * period);
};

export const multerConfig = {
	storage: {
		destination: (req, file, cb) => cb(null, path.resolve(__dirname, "../uploads")),
		filename: (req, file, cb) => {
			const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
			cb(null, uniqueSuffix + "-" + file.originalname);
		},
	},
	fileFilter: (req, file, cb) => {
		if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
			cb(null, true);
		} else {
			cb(null, false);
		}
	},
	limits: { fileSize: 1024 * 1024 * 2 },
};

// it's better to upload directly from client side as it will be faster but we need to secure firebase credentials and verfiy user token before upload (e.g. create endpoint and verfiy token and return firebase credentials in response)

type Upload = {
	success?: number;
	error?: boolean;
	message: string;
	file?: { url: string };
	status: number;
};
export const uploadBinaryFile = (files: any[], id: string, isFirebase = true): Promise<Upload> => {
	const baseURl = "https://firebasestorage.googleapis.com/v0/b/";
	return new Promise((resolve, reject) => {
		const file = files[0];
		console.log("file:", file);
		if (file.size > 1 * 1024 * 1024) return reject({ error: true, message: "File size is greater than 1MB", status: 400 });

		if (!["image/jpeg", "image/png", "image/gif", "image/jpg"].includes(file.mimetype)) {
			return reject({ error: true, message: "Invalid file type, only JPEG, PNG, GIF and JPG are allowed", status: 400 });
		}

		try {
			const b64 = Buffer.from(file.buffer).toString("base64");
			// const url = `data:${file.mimetype};base64,${b64}`;
			const data = `${b64}`;
			const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

			if (!isFirebase) {
				if (!fs.existsSync(path.resolve(__dirname, "../uploads/" + id))) fs.mkdirSync(path.resolve(__dirname, "../uploads/" + id));
				fs.writeFileSync(path.resolve(__dirname, `../uploads/${id}/${uniqueSuffix + "-" + file.originalname}`), data, "base64");
				// the valid response regarding image tool plugin of @editorjs is { success: 1, file: { url: "" } }
				return resolve({ success: 1, message: `Uploaded ${file.originalname}`, file: { url: `/api/uploads/${id}/${uniqueSuffix + "-" + file.originalname}` }, status: 200 });
			}

			const filePath = `${id}/${uniqueSuffix + "-" + file.originalname}`;
			console.log("filepath:", filePath);

			const storage = getStorage();
			const imagesRef = ref(storage, "images/" + filePath);

			// todo: in client side use file object as it's smaller in size from base64 (we are using base64 here as it's already used in non-firebase option above)
			uploadString(imagesRef, data, "base64", { contentType: file.mimetype }).then(snapshot => {
				// console.log("snapshot:\n", snapshot);
				const downloadUrl = baseURl + snapshot.metadata.bucket + "/o/" + encodeURIComponent(snapshot.metadata.fullPath) + "?alt=media";
				return resolve({ success: 1, message: `uploaded ${file.originalname}`, file: { url: downloadUrl }, status: 200 });
			});
		} catch (error) {
			return reject({ error: true, message: error.message, status: 400 });
		}
	});
};

export const slugify = (str: string) => {
	return str
		.replace(/[&\\/\\#,+()$~%.'":*?<>{}]/g, "")
		.split(" ")
		.join("-")
		.toLowerCase(); // todo: test arabic chars with تشكيل
};
