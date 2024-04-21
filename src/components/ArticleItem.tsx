import { cap, getLocalTime, getShortArticleDesc, getTextFromEditorBlocks, deleteArticle } from "../utils";
import { articleThumbnail, profilePic } from "../assets";
import { useState } from "react";
import { Dots } from "../assets/icons";
import { useNavigate } from "react-router-dom";
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

function ArticleItem({ article, isProfile, loggedUser }: { article: ARTICLE; isProfile?: boolean; loggedUser?: any }) {
	const navigate = useNavigate();
	const [isDeleted, setIsDeleted] = useState(false);
	const [isOpened, setIsOpened] = useState(false);

	const removeArticle = async (e: any) => {
		e.preventDefault();

		const confirmed = confirm("Do you want to delete this article?");
		if (!confirmed) return;

		await deleteArticle({ userId: loggedUser.userId, articleId: article._id });

		setIsDeleted(true);
	};

	const updateArticle = async (e: any) => {
		e.preventDefault();
		navigate(`/update-story/${article.slug}/of/${loggedUser.username}`);
	};

	const toggleMenu = (e: any) => {
		e.preventDefault();
		setIsOpened(!isOpened);
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
						<div className="max-w-52 flex gap-x-4 items-start">
							<img className="block object-cover w-28 h-28 max-w-[initial]" src={article?.thumbnail || articleThumbnail} alt="Article thumbnail" />
							{/* action menu */}
							{isProfile && loggedUser && article.ownedBy == loggedUser.userId && (
								<button type="button" className="relative" onClick={toggleMenu} onBlur={() => setTimeout(() => setIsOpened(false), 150)}>
									<Dots className="w-6 h-6 pointer-events-none text-text-light fill-text-light" />

									{isOpened && (
										<ul className="text-sm flex flex-col right-0 top-6 gap-y-2 absolute min-w-32 bg-white z-10 py-4 px-2 border border-border-light rounded shadow-search">
											<li onClick={updateArticle}>
												<span className="pointer-events-none gap-x-2 px-2 py-1 flex items-center">
													{/* <Edit className="w-4 h-4 text-text-light" /> */}
													<span className="text-sm text-text-light">Update article</span>
												</span>
											</li>
											<li className="text-sm tracking-widest uppercase border-b border-border-light text-text-light"></li>
											<li onClick={removeArticle}>
												<span className="pointer-events-none gap-x-2 px-2 py-1 items-center flex">
													{/* <Trash className="w-4 h-4 text-text-light" /> */}
													<span className="text-sm text-red">Delete article</span>
												</span>
											</li>
										</ul>
									)}
								</button>
							)}
						</div>
					</a>
				</article>
			)}
		</>
	);
}

export default ArticleItem;
