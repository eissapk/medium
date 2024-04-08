import { Like, Share, Play, Bookmark } from "../assets/icons";
const ArticleActions = ({
	isLogged,
	article,
	likeArticle,
	bookmarkArticle,
	playArticle,
	shareArticle,
}: {
	isLogged: object | null;
	article: { likes: string[] };
	likeArticle: () => void;
	bookmarkArticle: () => void;
	playArticle?: () => void;
	shareArticle: () => void;
}) => {
	return (
		<div className="flex items-center justify-between p-2 my-6 border-y border-border-light">
			{isLogged && (
				<button type="button" className="flex items-center gap-x-1" onClick={likeArticle}>
					<Like className="w-6 h-6 pointer-events-none text-text-light fill-text-light" />
					{!!article.likes.length && <span className="text-xs leading-normal pointer-events-none text-text-light">{article.likes.length}</span>}
				</button>
			)}
			{!isLogged && <span className="invisible"></span>}

			<div className="flex items-center gap-x-5">
				{/* todo: handle these (bookmark & play) later */}
				{false && isLogged && (
					<button type="button" onClick={bookmarkArticle}>
						<Bookmark className="w-6 h-6 pointer-events-none text-text-light fill-text-light" />
					</button>
				)}
				{false && playArticle && (
					<button type="button" onClick={playArticle}>
						<Play className="w-6 h-6 pointer-events-none text-text-light fill-text-light" />
					</button>
				)}

				<button type="button" onClick={shareArticle}>
					<Share className="w-6 h-6 pointer-events-none text-text-light fill-text-light" />
				</button>
			</div>
		</div>
	);
};
export default ArticleActions;
