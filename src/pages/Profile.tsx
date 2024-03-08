import { useLoaderData, defer, useOutletContext, Await } from "react-router-dom";
import ArticleItem from "../components/ArticleItem";
import { Suspense } from "react";
import Spinner from "../components/Spinner";

function Profile() {
	const user = useOutletContext();
	const { userArticles } = useLoaderData();

	if (!user.articles.length) return <p className="text-center text-text-light">No articles yet</p>;

	return (
		<Suspense fallback={<Spinner isArticle={true} />}>
			<Await resolve={userArticles}>
				{json => (
					<div className="grid grid-cols-1 mb-10 gap-y-10">
						{json.data.map((item, index) => (
							<ArticleItem key={index} article={item} user={user} isMe={true} />
						))}
					</div>
				)}
			</Await>
		</Suspense>
	);
}

export default Profile;

const loadArticles = async id => {
	const response = await fetch("/api/article/user/" + id, { headers: { "Content-Type": "application/json" } });
	const data = await response.json();

	if (data.error) {
		const error = new Error(data.message);
		error.code = response.status;
		throw error;
	}

	await new Promise(r => setTimeout(r, 1000)); // for testing

	return data;
};

export const loader = async ({ params }: { params: { userId: string } }) => {
	const { userId } = params;
	return defer({ userArticles: loadArticles(userId) });
};
