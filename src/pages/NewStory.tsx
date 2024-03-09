// todo add thumnail and editor
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cookies } from "../utils";
function NewStory() {
	const navigate = useNavigate();
	const [content, setContent] = useState("");
	const [title, setTitle] = useState("");

	const handleSubmit = async e => {
		e.preventDefault();

		console.log({
			content,
			title,
		});

		const response = await fetch("/api/article/create", {
			method: "POST",
			body: JSON.stringify({ content, title, thumbnail: "https://google.com/favicon" }),
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		});
		const data = await response.json();
		if (data.error) {
			const error = new Error(data.message);
			error.code = response.status;
			throw error;
		}

		const userId = cookies.get("userId");
		setContent("");
		setTitle("");
		const path = "/" + userId + "/" + data.data._id;
		console.log(path);

		navigate(path);
	};
	return (
		<form className="m-4" id="publishNewStory" onSubmit={handleSubmit}>
			<div className="mb-4">
				<label className="font-medium inline-block text-sm text-text-light min-w-[7rem]">Title</label>
				<input autoFocus className="w-full px-1 mx-4 transition-all border rounded-sm border-border-light" type="text" value={title} onChange={e => setTitle(e.target.value)} />
			</div>
			<div className="mb-4">
				<label className="font-medium inline-block text-sm text-text-light min-w-[7rem]">Content</label>
				<textarea value={content} onChange={e => setContent(e.target.value)} className="outline-none  w-full h-[50vh]" placeholder="Tell your story"></textarea>
			</div>
		</form>
	);
}

export default NewStory;
