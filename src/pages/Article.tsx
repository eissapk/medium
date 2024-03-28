import { Suspense } from "react";
import { Await, defer, useLoaderData } from "react-router-dom";
import { fetchAPI } from "../utils";
import Editor from "../components/Editor";
import Spinner from "../components/Spinner";
import { profilePic } from "../assets";

function Article() {
	const { article } = useLoaderData() as { article: any };

	// todo check if current profile is own by logged user (if so then add delete,update buttons for each article)
	return (
		<div>
			<Suspense fallback={<Spinner isArticle={true} />}>
				<Await resolve={article}>
					{data => (
						<div className="max-w-[40.625rem] mx-auto">
							<h1 className="text-5xl font-bold text-text-dark">{data.data.title}</h1>
							<div className="my-10">
								<a href={``} className="inline-flex items-center mb-2 gap-x-2">
									<img className="h-6 rounded-full" src={profilePic} alt="Author avatar" />
									<span className="text-sm font-medium">{"foo user"}</span>
								</a>
								{/* todo: add follow button, readtime, and date, then like and share buttons */}
							</div>
							<Editor readOnly={true} blocks={data.data.content} />
						</div>
					)}
				</Await>
			</Suspense>
		</div>
	);
}

export default Article;

const loadArticle = async (userId: string, articleId: string) => {
	console.log(userId);

	const response = await fetchAPI(`/api/article/${articleId}`, { headers: { "Content-Type": "application/json" } });
	const data = await response.json();
	if (data.error) {
		const error: any = new Error(data.message);
		error.code = response.status;
		throw error;
	}
	// console.log("loadArticle:", data);
	return data;
};
// export const loader = async ({ params }: { params: { userId: string; articleId: string } }) => {
export const loader = async ({ params }: any) => {
	return defer({ article: loadArticle(params.userId, params.articleId) });
};
