import { cap, getLocalTime, getShortArticleDesc, getTextFromEditorBlocks } from "../utils";
import { articleThumbnail, profilePic } from "../assets";
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
	};
};

getTextFromEditorBlocks;
function ArticleItem({ article, isProfile }: { article: ARTICLE; isProfile?: boolean }) {
	return (
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
				<div className="max-w-52">
					<img className="block object-cover w-28 h-28" src={article?.thumbnail || articleThumbnail} alt="Article thumbnail" />
				</div>
			</a>
		</article>
	);
}

export default ArticleItem;
