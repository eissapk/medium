import { Suspense, useEffect, useRef, useState } from "react";
import { Await, Link, defer, useLoaderData, useLocation } from "react-router-dom";
import { fetchAPI, cap, getLocalTime, cookies } from "../utils";
import Editor from "../components/Editor";
import Spinner from "../components/Spinner";
import { profilePic } from "../assets";
import FollowButton from "../components/FollowButton";
import ArticleActions from "../components/ArticleActions";

function Article() {
	const { data } = useLoaderData() as { data: any };
	const location = useLocation();
	const wrapper = useRef<HTMLDivElement>(null);
	const [isBottomArticleActionsShown, setIsBottomArticleActionsShown] = useState(false);
	const [article, setArticle] = useState<any>(null);
	const [likeIsPending, setLikeIsPending] = useState(false);

	useEffect(() => {
		data.then(({ article: articleObj }: { article: any }) => setArticle(articleObj));
	}, [data]);

	const likeArticle = async () => {
		setLikeIsPending(true);
		const { article, loggedUser } = await data;
		if (!loggedUser) return;
		const loggedUserId = loggedUser._id;
		const articleId = article._id;
		const response = await fetchAPI(`/api/article/${articleId}/likedby/${loggedUserId}`, { method: "GET", headers: { "Content-Type": "application/json" } });
		const json = await response.json(); // returned data is the updated article e.g. {data:{likes:[], slug:""}}

		if (json.error) {
			setLikeIsPending(false);
			const error: any = new Error(json.message);
			error.code = response.status;
			throw error;
		}

		setArticle(json.data);
		setLikeIsPending(false);
	};
	const bookmarkArticle = async () => {
		console.log("bookmarkArticle");
	};
	const playArticle = async () => {
		console.log("playArticle");
	};

	const onReady = () => {
		if (wrapper.current) {
			const h = wrapper.current.offsetHeight;
			if (h > window.innerHeight + 200) setIsBottomArticleActionsShown(true);
			else setIsBottomArticleActionsShown(false);
		}
	};
	// todo check if current profile is own by logged user (if so then add delete,update buttons for each article)
	return (
		<div className="pb-80 px-4" id="articlePage">
			<Suspense
				fallback={
					<div className="px-4 py-10 max-w-[40.625rem] mx-auto">
						<Spinner className="mb-2" isLine={true} />
						<Spinner isLine={true} />
					</div>
				}>
				<Await resolve={data}>
					{({ user, loggedUser }) => (
						<div className="max-w-[40.625rem] mx-auto" ref={wrapper}>
							{/* article title */}
							<h1 className="mt-10 text-4xl font-bold text-text-dark">{article?.title}</h1>
							{/* user info block (image, name, article read time, follow button, etc) */}
							<div className="flex items-center mt-10 mb-2 gap-x-4">
								<Link to={`/${user.username || user._id}`} className="">
									<img className="h-10 rounded-full" src={user.avatar || profilePic} alt="Author avatar" />
								</Link>
								<div>
									<div className="flex items-center gap-x-2">
										<Link to={`/${user.username || user._id}`}>
											<span className="text-sm font-">{cap(user.name || user.username)}</span>
										</Link>
										<FollowButton includeDot={true} alignDot="left" isArticle={true} relatedUser={user} loggedUser={loggedUser} profileUrl={location.pathname} />
									</div>
									<div className="flex items-center justify-center text-sm gap-x-2 text-text-light">
										<span>{article?.readTime} min read</span>
										<span className="text-text-light">.</span>
										<span>{getLocalTime(article?.createdAt)}</span>
									</div>
								</div>
							</div>

							<ArticleActions likeIsPending={likeIsPending} loggedUser={loggedUser} article={article} likeArticle={likeArticle} bookmarkArticle={bookmarkArticle} playArticle={playArticle} />
							<Editor readOnly={true} blocks={article?.content} onReady={onReady} />
							{isBottomArticleActionsShown && <ArticleActions likeIsPending={likeIsPending} loggedUser={loggedUser} article={article} likeArticle={likeArticle} bookmarkArticle={bookmarkArticle} />}
						</div>
					)}
				</Await>
			</Suspense>
		</div>
	);
}

export default Article;

const loadArticle = async (articleId: string, userId: string) => {
	const response = await fetchAPI(`/api/article/${articleId}/of/${userId}`, { headers: { "Content-Type": "application/json" } });
	const json = await response.json();
	if (json.error) {
		const error: any = new Error(json.message);
		error.code = response.status;
		throw error;
	}
	// console.log("loadArticle:", data);
	return json.data;
};

const loadUser = async (id: string) => {
	const response = await fetchAPI("/api/user/" + id, { headers: { "Content-Type": "application/json" } });
	const json = await response.json();

	if (json.error) {
		const error: any = new Error(json.message);
		error.code = response.status;
		throw error;
	}
	// console.log("loadUser:", json);
	return json.data;
};

const loadLoggedUser = async (id: string) => {
	if (!id) return null;
	const response = await fetchAPI("/api/user/" + id, { headers: { "Content-Type": "application/json" } });
	const json = await response.json();
	if (json.error) {
		const error: any = new Error(json.message);
		error.code = response.status;
		throw error;
	}
	// console.log("loadLoggedUser", json);
	return json.data;
};

const loadData = async (userId: string, loggedUserId: string, articleId: string) => {
	const article = await loadArticle(articleId, userId);
	const user = await loadUser(userId);
	const loggedUser = await loadLoggedUser(loggedUserId);
	// console.log({ article, user, loggedUser });

	return { article, user, loggedUser };
};
// export const loader = async ({ params }: { params: { userId: string; articleId: string } }) => {
export const loader = async ({ params }: any) => {
	const loggedUserId = cookies.get("username") || cookies.get("userId");
	return defer({ data: loadData(params.userId, loggedUserId, params.articleId) });
};
