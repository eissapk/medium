// import multer from "multer";
// const upload = multer({ dest: "." });
export const uploadByFile = (req, res) => {
	console.log("upload file", req.file);
	console.log("upload body", req.body);
	// res.status(200).json({ success: true, message: "uploaded by file" });
};

export const uploadByUrl = (req, res) => {
	console.log("upload url", req.body);
	res.status(200).json({ success: true, message: "uploaded by url" });
};

// import multer from "multer";
// const upload = multer({ dest: "." });
// router.post("/byfile", upload.single("uploaded_file"), function (req, res) {
// 	// req.file is the name of your file in the form above, here 'uploaded_file'
// 	// req.body will hold the text fields, if there were any
// 	console.log(req.file, req.body);
// });
