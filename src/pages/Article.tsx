import { Suspense } from "react";
import { Await, defer, useLoaderData } from "react-router-dom";
import { fetchAPI } from "../utils";

function Article() {
	const { article } = useLoaderData() as { article: any };

	// todo check if current profile is own by logged user (if so then add delete,update buttons for each article)
	return (
		<div>
			<Suspense fallback={<p>Loading...</p>}>
				<Await resolve={article}>
					{data => (
						<div className="text-center">
							<h1 className="m-4 text-3xl text-text-dark">{data.data.title}</h1>
							<p className="text-text-light">{data.data.content}</p>
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

	// const response = await fetch(`/api/article/${articleId}`, { headers: { "Content-Type": "application/json" } });
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
