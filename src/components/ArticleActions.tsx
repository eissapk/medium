import { useEffect, useRef, useState } from "react";
import cx from "classnames";
import { Like, Share, Play, Bookmark, Twitter, Copy, Facebook, Linkedin } from "../assets/icons";
const providers: any = {
	facebook: `https://www.facebook.com/sharer/sharer.php?u=`,
	// facebook : `https://www.facebook.com/dialog/share?app_id=87741124305&href=`, // use it if you have a registered app in facebook
	twitter: `https://twitter.com/intent/tweet?url=`,
	linkedin: `http://www.linkedin.com/shareArticle?url=`,
};
const ArticleActions = ({
	likeIsPending,
	loggedUser,
	article,
	likeArticle,
	bookmarkArticle,
	playArticle,
}: {
	likeIsPending: boolean;
	loggedUser: object | null | any;
	article: { likes: string[] };
	likeArticle: () => void;
	bookmarkArticle: () => void;
	playArticle?: () => void;
}) => {
	const [shareListIsShown, setShareListIsShown] = useState(false);
	const [isLiked, setIsLiked] = useState(false);
	const shareBtn = useRef(null);

	useEffect(() => {
		if (loggedUser && article) {
			if (article.likes.includes(loggedUser._id)) setIsLiked(true);
			else setIsLiked(false);
		}
		document.body.addEventListener("click", handleShareMenu);
		return () => document.body.removeEventListener("click", handleShareMenu);
	}, [article, loggedUser]);

	const handleShareMenu = (e: any) => {
		if (!shareBtn || !shareBtn.current) return;
		if (e.target !== shareBtn.current) setTimeout(() => setShareListIsShown(false), 100);
	};

	const shareArticle = async () => {
		setShareListIsShown(!shareListIsShown);
	};

	// todo: add cross browser code to copy link to clipboard
	const copyLink = () => {
		const id = "copyInput";
		let input = document.getElementById(id);
		if (!input) {
			input = document.createElement("input");
			input.id = id;
			// @ts-expect-error -- handle it later
			input.type = "text";
			input.style.cssText = "position:absolute; opacity:0; z-index:-1; left:0; top:0; pointer-events:none";
			document.body.append(input);
		}

		// @ts-expect-error -- handle it later
		input.value = location.href;
		// @ts-expect-error -- handle it later
		input.select();
		// @ts-expect-error -- handle it later
		input.setSelectionRange(0, 99999);
		document.execCommand("copy");
	};

	const share = (provider: string) => {
		window.open(
			`${providers[provider]}${location.href}`,
			"popUpWindow",
			"height=500,width=400,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes"
		);
	};
	return (
		<div className="flex items-center justify-between p-2 my-6 border-y border-border-light">
			{/* for uesr */}
			{loggedUser && (
				<button type="button" className="flex items-center gap-x-1 group/articleActions" onClick={likeArticle} disabled={likeIsPending}>
					<Like
						state={isLiked ? "like" : "unlike"}
						className={cx("w-6 h-6 pointer-events-none group-hover/articleActions:text-text-dark group-hover/articleActions:fill-text-dark", {
							"text-text-dark fill-text-dark": isLiked,
							"text-text-light fill-text-light": !isLiked,
							"opacity-30": likeIsPending,
						})}
					/>
					{!!article.likes.length && (
						<span className="text-xs leading-normal pointer-events-none text-text-light group-hover/articleActions:text-text-dark group-hover/articleActions:fill-text-dark">
							{article.likes.length}
						</span>
					)}
				</button>
			)}

			{/* for non-user */}
			{!loggedUser && (
				<button type="button" className="flex items-center gap-x-1 " disabled={true}>
					<Like className={cx("w-6 h-6 pointer-events-none text-text-light fill-text-light")} />
					{!!article.likes.length && <span className="text-xs leading-normal pointer-events-none text-text-light">{article.likes.length}</span>}
				</button>
			)}

			<div className="flex items-center gap-x-5">
				{/* todo: handle these (bookmark & play) later */}
				{false && loggedUser && (
					<button type="button" onClick={bookmarkArticle} className="group/articleActions">
						<Bookmark className="w-6 h-6 pointer-events-none text-text-light fill-text-light group-hover/articleActions:text-text-dark group-hover/articleActions:fill-text-dark" />
					</button>
				)}
				{false && playArticle && (
					<button type="button" onClick={playArticle} className="group/articleActions">
						<Play className="w-6 h-6 pointer-events-none text-text-light fill-text-light group-hover/articleActions:text-text-dark group-hover/articleActions:fill-text-dark" />
					</button>
				)}

				<button type="button" className="relative group/articleActions" onClick={shareArticle} ref={shareBtn}>
					<Share className="w-6 h-6 pointer-events-none text-text-light fill-text-light group-hover/articleActions:text-text-dark group-hover/articleActions:fill-text-dark" />
					{shareListIsShown && (
						<ul className="text-sm flex flex-col left-1/2 top-[calc(100%+0.5rem)] -translate-x-1/2 absolute min-w-[15rem] bg-white z-10 py-4 border border-border-light rounded shadow-search">
							<li className="px-4 py-2" onClick={copyLink}>
								<span className="flex items-center w-full pointer-events-none gap-x-3">
									<Copy className="w-6 h-6 pointer-events-none fill-text-light text-text-light" />
									<span className="text-sm pointer-events-none text-text-light">Copy link</span>
								</span>
							</li>
							<li className="text-sm tracking-widest uppercase border-b border-border-light text-text-light"></li>
							<li className="px-4 py-2" onClick={() => share("twitter")}>
								<span className="flex items-center w-full pointer-events-none gap-x-3">
									<Twitter className="w-6 h-6 pointer-events-none fill-text-light text-text-light" />
									<span className="text-sm pointer-events-none text-text-light">Share on Twitter</span>
								</span>
							</li>
							<li className="px-4 py-2" onClick={() => share("facebook")}>
								<span className="flex items-center w-full pointer-events-none gap-x-3">
									<Facebook className="w-6 h-6 pointer-events-none fill-text-light text-text-light" />
									<span className="text-sm pointer-events-none text-text-light">Share on Facebook</span>
								</span>
							</li>
							<li className="px-4 py-2" onClick={() => share("linkedin")}>
								<span className="flex items-center w-full pointer-events-none gap-x-3">
									<Linkedin className="w-6 h-6 pointer-events-none fill-text-light text-text-light" />
									<span className="text-sm pointer-events-none text-text-light">Share on LinkedIn</span>
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
