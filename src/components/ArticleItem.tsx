import { getLocalTime, getNameFromEmail, getShortArticleDesc } from "../utils";
import articleThumbnail from "../assets/article-thumbnail.webp";
import profilePic from "../assets/profile-pic.webp";
type ARTICLE = {
	_id: string;
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
	};
};

function ArticleItem({ article, isMe }: { article: ARTICLE; isMe?: boolean }) {
	return (
		<article>
			{!isMe && (
				<a href={`/${article.ownedBy}`} className="inline-flex items-center mb-2 gap-x-2">
					<img className="h-6 rounded-full" src={article.user?.avatar || profilePic} alt="Author avatar" />
					<span className="text-sm font-medium">{article.user?.name || getNameFromEmail(article.user?.email)}</span>
				</a>
			)}

			<a href={`/${article.ownedBy}/${article?._id}`} className="flex gap-x-5">
				<div className="max-w-lg min-w-[65%]">
					<h1 className="mb-1 text-xl font-bold text-text-dark">{article?.title}</h1>
					<p className="mb-2 text-text-light">{getShortArticleDesc(article?.content)}</p>
					<span className="text-[0.8rem] text-text-light">
						{/* {getLocalTime(article?.createdAt)} . {article?.readTime} min read */}
						{getLocalTime(article?.createdAt)} . {10} min read
					</span>
				</div>
				<div className="max-w-52">
					{/* <img className="block w-full h-auto" src={article?.thumbnail || articleThumbnail} alt="Article thumbnail" /> */}
					<img className="block w-full h-auto" src={articleThumbnail} alt="Article thumbnail" />
				</div>
			</a>
		</article>
	);
}

export default ArticleItem;
