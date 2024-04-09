import { useEffect, useState } from "react";
import cx from "classnames";
import { Like, Share, Play, Bookmark, Twitter, Copy, Facebook, Linkedin } from "../assets/icons";
const ArticleActions = ({
	shareListIsShown,
	loggedUser,
	article,
	likeArticle,
	bookmarkArticle,
	playArticle,
	shareArticle,
}: {
	shareListIsShown: boolean;
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
					{!isLiked && <Like state="unlike" className={cx("w-6 h-6 pointer-events-none text-text-light fill-text-light")} />}
					{isLiked && <Like state="like" className={cx("w-6 h-6 pointer-events-none text-text-dark fill-text-dark")} />}
					{/* <Like
						className={cx("w-6 h-6 pointer-events-none ", {
							"text-text-light fill-text-light": !isLiked,
							"text-black-900 fill-black-900": isLiked, // todo: change liked color : check real meadium article example
						})}
					/> */}
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

				<button type="button" className="relative" onClick={shareArticle}>
					<Share className="w-6 h-6 pointer-events-none text-text-light fill-text-light" />
					{shareListIsShown && (
						<ul className="flex flex-col left-1/2 top-[calc(100%+0.5rem)] -translate-x-1/2 gap-y-4 absolute min-w-[15rem] bg-white z-10 p-4 border border-border-light rounded shadow-search">
							<li>
								<span className="flex items-center w-full gap-x-2">
									<Copy className="w-6 h-6 pointer-events-none fill-text-light text-text-light " />
									<span className="text-sm pointer-events-none text-text-light">Copy link</span>
								</span>
							</li>
							<li className="text-sm tracking-widest uppercase border-b border-border-light text-text-light"></li>
							<li>
								<span className="flex items-center w-full gap-x-2">
									<Twitter className="w-6 h-6 pointer-events-none fill-text-light text-text-light" />
									<span className="text-sm pointer-events-none text-text-light">Share on Twitter</span>
								</span>
							</li>

							<li>
								<span className="flex items-center w-full gap-x-2">
									<Facebook className="w-6 h-6 pointer-events-none fill-text-light text-text-light" />
									<span className="text-sm pointer-events-none text-text-light">Share on Twitter</span>
								</span>
							</li>
							<li>
								<span className="flex items-center w-full gap-x-2">
									<Linkedin className="w-6 h-6 pointer-events-none fill-text-light text-text-light" />
									<span className="text-sm pointer-events-none text-text-light">Share on Twitter</span>
								</span>
							</li>
						</ul>
					)}
				</button>
			</div>
		</div>
	);
};
export default ArticleActions;
