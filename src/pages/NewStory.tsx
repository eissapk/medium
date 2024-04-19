// todo validate inputs with yup and formik
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cookies, fetchAPI } from "../utils";
import Editor from "../components/Editor";

// todo: handle validation using yup and formik
function NewStory() {
	const navigate = useNavigate();
	const [title, setTitle] = useState("");
	const [readTime, setReadTime] = useState(5);
	const [editor, setEditor] = useState<any>(null);
	const titleRef = useRef(null);

	useEffect(() => {
		const email = cookies.get("email"); // set by server
		const id = cookies.get("username") || cookies.get("userId"); // set by server
		if (!email || !id) location.replace("/");
	}, []);

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		const savedData = await editor.saver.save();
		const content = savedData.blocks;
		let thumbnail = null;

		const firstImage = content.find((block: any) => block.type === "image");
		if (firstImage) thumbnail = firstImage.data.file.url;

		// console.log({ content, thumbnail, title, readTime, savedData });

		const response = await fetchAPI("/api/article/create", {
			method: "POST",
			body: JSON.stringify({ content, title, thumbnail, readTime }),
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		});

		const json = await response.json();
		if (json.error) {
			const error: any = new Error(json.message);
			error.code = response.status;
			throw error;
		}

		const userId = cookies.get("username") || cookies.get("userId");
		setTitle("");
		setReadTime(1);

		navigate("/" + userId + "/" + (json.data.slug || json.data._id)); // navigate to article path
	};

	// do cool stuff here -- look at docs
	const onReady = (editor: any) => {
		setEditor(editor);
		// @ts-expect-error -- handle focus method later
		if (titleRef?.current) titleRef.current?.focus();
	};

	return (
		<form className="px-4 py-6 mx-auto xl:px-0 max-w-max" id="publishNewStory" onSubmit={handleSubmit}>
			<div className="mb-6 grid gap-y-4 grid-cols-1 md:grid-cols-[2fr_12rem]">
				<div className="w-full">
					<input
						ref={titleRef}
						placeholder="Title"
						className="w-full text-4xl font-bold text-center outline-none md:text-start text-text-dark"
						type="text"
						value={title}
						onChange={e => setTitle(e.target.value)}
					/>
				</div>
				<div className="flex items-center justify-center xl:justify-end gap-x-2">
					<label className="text-sm font-medium text-text-light">Read time</label>
					<input className="text-5xl font-bold text-center outline-none text-text-dark max-w-24" type="number" value={readTime} min={1} onChange={e => setReadTime(+e.target.value)} />
				</div>
			</div>
			<Editor onReady={onReady} />
		</form>
	);
}

export default NewStory;
