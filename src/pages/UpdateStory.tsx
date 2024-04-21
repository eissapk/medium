import { Await, defer, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { Suspense, useRef, useState } from "react";
import { cookies, fetchAPI } from "../utils";
import Editor from "../components/Editor";
import Input from "../components/Input";
import { Form, Formik } from "formik";
import { newStorySchema } from "../schema";
import Spinner from "../components/Spinner";

function UpdateStory() {
	const { articleId, userId } = useParams();
	const { data } = useLoaderData() as any;
	const navigate = useNavigate();
	const [editor, setEditor] = useState<any>(null);
	const [editorError, setEditorError] = useState<string>("");
	const formRef = useRef(null);

	const submitHandler = async (values: any) => {
		const savedData = await editor.saver.save();
		const content = savedData.blocks;
		if (!content.length) return setEditorError("Please add some content");
		let thumbnail = null;

		const firstImage = content.find((block: any) => block.type === "image");
		if (firstImage) thumbnail = firstImage.data.file.url;

		// return console.log({ content, thumbnail, title: values.title, readTime: values.readTime });

		const response = await fetchAPI(`/api/article/${articleId}/of/${userId}`, {
			method: "PUT",
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
		<Suspense
			fallback={
				<div className="px-4 py-10 max-w-[40.625rem] mx-auto">
					<Spinner className="mb-2" isLine={true} />
					<Spinner isLine={true} />
				</div>
			}>
			<Await resolve={data}>
				{json => (
					<Formik initialValues={{ title: json.title, readTime: json.readTime }} validationSchema={newStorySchema} onSubmit={submitHandler}>
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
							<Editor blocks={json.content} onReady={onReady} />
						</Form>
					</Formik>
				)}
			</Await>
		</Suspense>
	);
}

export default UpdateStory;

const loadArticle = async (articleId: string, userId: string) => {
	const response = await fetchAPI(`/api/article/${articleId}/of/${userId}`, { headers: { "Content-Type": "application/json" } });
	const json = await response.json();

	if (json.error) {
		const error: any = new Error(json.message);
		error.code = response.status;
		throw error;
	}

	// console.log(json.data);

	return json.data;
};

export const loader = async ({ params }: any) => {
	const email = cookies.get("email"); // set by server
	const id = cookies.get("username") || cookies.get("userId"); // set by server
	if (!email || !id) return location.replace("/"); // skip fetching if not logged in and redirect to home

	const { articleId, userId } = params;
	return defer({ data: loadArticle(articleId, userId) });
};
