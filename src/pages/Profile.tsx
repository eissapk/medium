import { useLoaderData, defer, useOutletContext, Await } from "react-router-dom";
import ArticleItem from "../components/ArticleItem";
import { Suspense } from "react";
import Spinner from "../components/Spinner";
import { fetchAPI } from "../utils";

function Profile() {
	const { user } = useOutletContext() as { user: any };
	const { userArticles } = useLoaderData() as { userArticles: any };
	// todo check if current profile is own by logged user (if so then add delete,update buttons for each article)

	if (!user.articles.length) return <p className="text-xs text-center text-text-light">No articles yet</p>;

	return (
		<Suspense fallback={<Spinner isArticle={true} />}>
			<Await resolve={userArticles}>
				{json => (
					<div className="grid grid-cols-1 mb-10 gap-y-10">
						{json.data.map((item: any, index: number) => (
							<ArticleItem key={index} article={{ ...item, user }} isProfile={true} />
						))}
					</div>
				)}
			</Await>
		</Suspense>
	);
}

export default Profile;

const loadArticles = async (id: string) => {
	// const response = await fetch("/api/article/user/" + id, { headers: { "Content-Type": "application/json" } });
	const response = await fetchAPI("/api/article/user/" + id, { headers: { "Content-Type": "application/json" } });
	const data = await response.json();

	if (data.error) {
		const error: any = new Error(data.message);
		error.code = response.status;
		throw error;
	}

	// await new Promise(r => setTimeout(r, 500)); // for testing

	return data;
};

// export const loader = async ({ params }: { params: { userId: string } }) => {
export const loader = async ({ params }: any) => {
	const { userId } = params;
	return defer({ userArticles: loadArticles(userId) });
};
