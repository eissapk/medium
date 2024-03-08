import { getLocalTime } from "../utils";
import articleThumbnail from "../assets/article-thumbnail.webp";
import profilePic from "../assets/profile-pic.webp";
import { getNameFromEmail } from "../utils";
type ARTICLE = {
	_id: string;
	title: string;
	thumbnail: string;
	content: string;
	readTime: number;
	createdAt: string;
};

type USER = {
	_id: string;
	avatar: string;
	name: string;
};

function ArticleItem({ article, user, isMe }: { article: ARTICLE; user: USER; isMe?: boolean }) {
	return (
		<article>
			{!isMe && (
				<a href={`/${user?._id}`} className="inline-flex items-center mb-2 gap-x-2">
					<img className="h-6 rounded-full" src={user?.avatar || profilePic} alt="Author avatar" />
					<span className="text-sm font-medium">{user?.name || getNameFromEmail(user?.email)}</span>
				</a>
			)}

			<a href={`/${user?._id}/${article?._id}`} className="flex gap-x-5">
				<div className="max-w-lg min-w-[65%]">
					<h1 className="mb-1 text-xl font-bold text-text-dark">{article?.title}</h1>
					<p className="mb-2 text-text-light">{article?.content}</p>
					<span className="text-[0.8rem] text-text-light">
						{getLocalTime(article?.createdAt)} . {article?.readTime} min read
					</span>
				</div>
				<div className="max-w-52">
					<img className="block w-full h-auto" src={article?.xthumbnail || articleThumbnail} alt="Article thumbnail" />
				</div>
			</a>
		</article>
	);
}

export default ArticleItem;
