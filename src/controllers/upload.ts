import { uploadBinaryFile } from "../utils";

export const uploadByFile = async (req, res) => {
	try {
		const response = await uploadBinaryFile(req.files, req.user._id, false);
		res.status(response.status).json(response);
	} catch (error) {
		res.status(400).json({ error: true, message: error.message });
	}
};

export const uploadByUrl = (req, res) => {
	console.log("upload file", req.files);
	console.log("upload body", req.body);
	const url = req.body.url;
	res.status(200).json({ success: 1, message: `uploaded ${url}`, file: { url }, status: 200 });

};
