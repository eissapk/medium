import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cookies, fetchAPI } from "../utils";
import Editor from "../components/Editor";
import Input from "../components/Input";
import { Form, Formik } from "formik";
import { newStorySchema } from "../schema";

const initialValues = { title: "", readTime: 1 };
function NewStory() {
	const navigate = useNavigate();
	const [editor, setEditor] = useState<any>(null);
	const [editorError, setEditorError] = useState<string>("");
	const formRef = useRef(null);

	useEffect(() => {
		const email = cookies.get("email"); // set by server
		const id = cookies.get("username") || cookies.get("userId"); // set by server
		if (!email || !id) location.replace("/");
	}, []);

	const submitHandler = async (values: any) => {
		const savedData = await editor.saver.save();
		const content = savedData.blocks;
		if (!content.length) return setEditorError("Please add some content");
		let thumbnail = null;

		const firstImage = content.find((block: any) => block.type === "image");
		if (firstImage) thumbnail = firstImage.data.file.url;

		// return console.log({ content, thumbnail, title: values.title, readTime: values.readTime });

		const response = await fetchAPI("/api/article/create", {
			method: "POST",
			body: JSON.stringify({ content, title: values.title, thumbnail, readTime: values.readTime }),
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
		setEditorError("");

		navigate("/" + userId + "/" + (json.data.slug || json.data._id)); // navigate to article path
	};

	// do cool stuff here -- look at docs
	const onReady = (editor: any) => {
		setEditor(editor);
		// focus on first input
		if (formRef?.current) {
			// @ts-expect-error -- handle it later
			const input = formRef.current.querySelector("input");
			if (input) input.focus();
		}
	};

	return (
		<Formik initialValues={initialValues} validationSchema={newStorySchema} onSubmit={submitHandler}>
			<Form ref={formRef} className="px-4 py-6 mx-auto xl:px-0 max-w-max" id="publishNewStory">
				<div className="mb-6 grid gap-y-4 grid-cols-1 md:grid-cols-[2fr_15rem]">
					<div className="w-full">
						<Input placeholder="Title" className="w-full text-4xl font-bold text-center outline-none md:text-start text-text-dark border-none" name="title" type="text" />
					</div>
					<div>
						<Input
							wrapperClassName="flex items-center justify-center xl:justify-end gap-x-2"
							min={1}
							max={60}
							className="text-5xl font-bold text-center outline-none text-text-dark max-w-24 border-none"
							labelStyle={"text-sm font-medium text-text-light"}
							label="Read time"
							name="readTime"
							type="number"
						/>
					</div>
				</div>
				{editorError && <p className="my-2 text-xs text-center text-red">{editorError}</p>}
				<Editor onReady={onReady} />
			</Form>
		</Formik>
	);
}

export default NewStory;
