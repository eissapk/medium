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
	function getLocalTime(date) {
		const t = new Date(date).toString();
		return `${t.split(" ")[1]} ${t.split(" ")[2]}, ${t.split(" ")[3]}`;
	}
	return (
		<article>
			{!isMe && (
				<a href={`/${user?._id}`} className="inline-flex items-center mb-2 gap-x-2">
					<img className="h-6 rounded-full" src={user?.avatar} alt="Author avatar" />
					<span className="text-sm font-medium">{user?.name}</span>
				</a>
			)}

			<a href={`/${user?._id}/${article?._id}`} className="flex gap-x-5">
				<div className="max-w-lg">
					<h1 className="mb-1 text-xl font-bold text-text-dark">{article?.title}</h1>
					<p className="mb-2 text-text-light">{article?.content}</p>
					<span className="text-[0.8rem] text-text-light">
						{getLocalTime(article?.createdAt)} . {article?.readTime} min read
					</span>
				</div>
				<div className="max-w-52">
					<img className="block w-full h-auto" src={article?.thumbnail} alt="Article thumbnail" />
				</div>
			</a>
		</article>
	);
}

export default ArticleItem;
