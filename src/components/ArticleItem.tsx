import { cap, fetchAPI, getLocalTime, getShortArticleDesc, getTextFromEditorBlocks } from "../utils";
import { articleThumbnail, profilePic } from "../assets";
import { useState } from "react";
type ARTICLE = {
	_id: string;
	slug: string;
	title: string;
	thumbnail: string;
	content: string;
	readTime: number;
	createdAt: string;
	ownedBy: string;
	user: {
		avatar: string;
		name: string;
		email: string;
		username: string;
		_id: string;
	};
};

// todo: continue delete and update artcles
function ArticleItem({ article, isProfile, loggedUser }: { article: ARTICLE; isProfile?: boolean; loggedUser?: any }) {
	const [isDeleted, setIsDeleted] = useState(false);

	const deleteArticle = async (e: any) => {
		e.preventDefault();
		const userId = loggedUser.userId;
		const articleId = article._id;
		const confirmed = confirm("Do you want to delete this article?");
		if (!confirmed) return;

		console.log({ userId, articleId });
		const response = await fetchAPI(`/api/article/${articleId}/of/${userId}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, credentials: "include" });
		const json = await response.json();
		if (json.error) {
			const error: any = new Error(json.message);
			error.code = response.status;
			throw error;
		}
		console.log(json);
		setIsDeleted(true);
	};
	const updateArticle = async (e: any) => {
		e.preventDefault();
		console.log("updateArticle");
	};

	return (
		<>
			{!isDeleted && (
				<article>
					{!isProfile && (
						<a href={`/${article.user.username || article.ownedBy}`} className="inline-flex items-center mb-2 gap-x-2">
							<img className="h-6 rounded-full" src={article.user?.avatar || profilePic} alt="Author avatar" />
							<span className="text-sm font-medium">{cap(article.user?.name || article.user?.username)}</span>
						</a>
					)}

					<a href={`/${article.user.username || article.ownedBy}/${article?.slug || article?._id}`} className="flex justify-between gap-x-5">
						<div className="max-w-lg min-w-[65%]">
							<h1 className="mb-1 text-xl font-bold text-text-dark">{article?.title}</h1>
							<p className="mb-2 text-text-light">{getShortArticleDesc(getTextFromEditorBlocks(article?.content))}</p>
							<span className="text-[0.8rem] text-text-light">
								{getLocalTime(article?.createdAt)} . {article?.readTime} min read
							</span>
						</div>
						<div className="max-w-52 flex gap-x-4 items-center">
							<img className="block object-cover w-28 h-28 max-w-[initial]" src={article?.thumbnail || articleThumbnail} alt="Article thumbnail" />
							{isProfile && loggedUser && article.ownedBy == loggedUser.userId && (
								<>
									<button type="button" onClick={deleteArticle} className="p-2">
										delete
									</button>
									<button type="button" onClick={updateArticle} className="p-2">
										update
									</button>
								</>
							)}
						</div>
					</a>
				</article>
			)}
		</>
	);
}

export default ArticleItem;
