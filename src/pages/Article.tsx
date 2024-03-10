import { Suspense } from "react";
import { Await, defer, useLoaderData } from "react-router-dom";

function Article() {
	const { article } = useLoaderData();

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

const loadArticle = async (userId, articleId) => {
	const response = await fetch(`/api/article/${articleId}`, { headers: { "Content-Type": "application/json" } });
	const data = await response.json();
	if (data.error) {
		const error = new Error(data.message);
		error.code = response.status;
		throw error;
	}
	// console.log("loadArticle:", data);
	return data;
};
export const loader = async ({ params }: { params: { userId: string; articleId: string } }) => {
	return defer({ article: loadArticle(params.userId, params.articleId) });
};
