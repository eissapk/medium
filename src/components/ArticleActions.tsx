import { useEffect, useState } from "react";
import cx from "classnames";
import { Like, Share, Play, Bookmark } from "../assets/icons";
const ArticleActions = ({
	loggedUser,
	article,
	likeArticle,
	bookmarkArticle,
	playArticle,
	shareArticle,
}: {
	loggedUser: object | null | any;
	article: { likes: string[] };
	likeArticle: () => void;
	bookmarkArticle: () => void;
	playArticle?: () => void;
	shareArticle: () => void;
}) => {
	const [isLiked, setIsLiked] = useState(false);
	useEffect(() => {
		if (loggedUser && article) {
			if (article.likes.includes(loggedUser._id)) setIsLiked(true);
			else setIsLiked(false);
		}
	}, [article, loggedUser]);
	return (
		<div className="flex items-center justify-between p-2 my-6 border-y border-border-light">
			{loggedUser && (
				<button type="button" className="flex items-center gap-x-1" onClick={likeArticle}>
					<Like
						className={cx("w-6 h-6 pointer-events-none ", {
							"text-text-light fill-text-light": !isLiked,
							"text-black-900 fill-black-900": isLiked, // todo: change liked color : check real meadium article example
						})}
					/>
					{!!article.likes.length && <span className="text-xs leading-normal pointer-events-none text-text-light">{article.likes.length}</span>}
				</button>
			)}
			{!loggedUser && <span className="invisible"></span>}

			<div className="flex items-center gap-x-5">
				{/* todo: handle these (bookmark & play) later */}
				{false && loggedUser && (
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
