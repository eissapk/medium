// todo add thumnail and editor
// todo validate inputs with yup and formik
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cookies, fetchAPI } from "../utils";
import Editor from "../components/Editor";
function NewStory() {
	const navigate = useNavigate();
	const [content, setContent] = useState("");
	const [title, setTitle] = useState("");
	const [thumbnail, setThumbnail] = useState(null);
	const [readTime, setReadTime] = useState(1);

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		console.log({
			content,
			title,
		});

		const response = await fetchAPI("/api/article/create", {
			method: "POST",
			body: JSON.stringify({ content, title, thumbnail, readTime }),
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		});
		const data = await response.json();
		if (data.error) {
			const error: any = new Error(data.message);
			error.code = response.status;
			throw error;
		}

		const userId = cookies.get("userId");
		setContent("");
		setTitle("");
		setReadTime(1);
		// todo add thumnail from 1st image in parsed content
		setThumbnail(null);
		const path = "/" + userId + "/" + data.data._id;
		console.log(path);

		navigate(path);
	};
	useEffect(() => {}, []);

	return (
		<>
			<form className="m-4" id="publishNewStory" onSubmit={handleSubmit}>
				<div className="max-w-max mx-auto flex flex-col md:flex-row gap-x-4 p-2 pb-0">
					<div className="mb-4 md:mb-0 max-w-lg">
						<label className="font-medium inline-block text-sm text-text-light min-w-[7rem]">Title</label>
						<input autoFocus className="w-full px-1 transition-all border rounded-sm border-border-light" type="text" value={title} onChange={e => setTitle(e.target.value)} />
					</div>
					<div className="mb-4 max-w-20 md:mb-0">
						<label className="font-medium inline-block text-sm text-text-light min-w-[7rem]">Read time</label>
						<input className="w-full px-1 text-center transition-all border rounded-sm border-border-light" type="number" value={readTime} onChange={e => setReadTime(+e.target.value)} />
					</div>
				</div>

				{/* <div className="max-w-max mx-auto p-2 pt-4">
					<textarea value={content} onChange={e => setContent(e.target.value)} className="outline-none  w-full h-[50vh]" placeholder="Tell your story"></textarea>
				</div> */}
			</form>
			<Editor />
		</>
	);
}

export default NewStory;
