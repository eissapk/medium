import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { useLogout } from "../hooks/useLogout";
import { Link } from "react-router-dom";
import { Profile, Edit, LogoMini, Search } from "../assets/icons";
import { useAuthContext } from "../hooks/useAuthContext";
import { fetchAPI, getLocalTime, getShortArticleTitle } from "../utils";
import { profilePic } from "../assets";
import Spinner from "./Spinner";
// todo: split this into  components

function UserNav() {
	const navigate = useNavigate();
	const { state } = useAuthContext();
	const { logout } = useLogout();
	const { pathname } = useLocation();
	const avatar = useRef(null);
	const searchInput = useRef(null);
	const [t, setT] = useState<null | ReturnType<typeof setTimeout>>(null);
	const [searchData, setSearchData] = useState({ users: [], articles: [] });
	const [isMenuShown, setIsMenuShown] = useState(false);
	const [isSearchShown, setIsSearchShown] = useState(false);
	const [isNewStoryRoute, setIsNewStoryRoute] = useState(false);
	const [isSearchError, setIsSearchError] = useState(false);
	const [isSearchPending, setIsSearchPending] = useState(true);
	const [searchError, setSearchError] = useState("");
	// todo: use useMutation here

	const handleMenuClick = (e: any) => {
		if (e.target !== avatar.current) setIsMenuShown(false);
	};
	const handleSearchClick = (e: any) => {
		if (e.target !== searchInput.current) setIsSearchShown(false);
	};

	const handleClicks = (e: any) => {
		handleMenuClick(e);
		handleSearchClick(e);
	};

	useEffect(() => {
		if (pathname === "/new-story") setIsNewStoryRoute(true);
		else setIsNewStoryRoute(false);
		document.body.addEventListener("click", handleClicks);
		return () => document.body.removeEventListener("click", handleClicks);
	}, [pathname, handleClicks]);

	const handleLogout = () => {
		logout();
		setTimeout(() => navigate("/"), 200);
	};

	const handleQuery = (text: string) => {
		if (text.trim() === "") return setIsSearchShown(false);
		if (t) clearTimeout(t);
		setT(setTimeout(() => search(text.trim()), 200)); // debounce each 200ms
	};

	const search = async (text: string) => {
		setIsSearchPending(true);
		setIsSearchShown(true);
		// todo fix error handler -- unexpected token | json
		// todo: check if we are in home page or user page
		const response = await fetchAPI(`/api/search/${text}`, { headers: { "Content-Type": "application/json" } });
		const json = await response.json();
		console.log(json);
		setSearchData(json.data);
		setIsSearchError(false);
		setSearchError("");
		setIsSearchPending(false);

		if (json.error) {
			setIsSearchError(true);
			setSearchError(json.message);
			setIsSearchPending(false);
			const error: any = new Error(json.message);
			error.code = response.status;
			throw error;
		}
	};

	return (
		<nav className="flex flex-col items-center justify-between py-2 bg-white gap-y-5 sm:flex-row">
			<ul className="flex items-center gap-x-5">
				<li>
					<Link to="/">
						<LogoMini className="h-6 " />
					</Link>
				</li>
				{!isNewStoryRoute && (
					<li className="rounded-[1.25rem] bg-input flex relative items-center justify-items-center">
						<Search className="absolute w-6 h-6 pointer-events-none ms-4 text-text-light" />
						<input
							ref={searchInput}
							onChange={e => handleQuery(e.target.value)}
							type="text"
							placeholder="Search"
							className="outline-none text-sm placeholder:text-text-light min-h-10 p-2.5 ps-12 bg-transparent min-w-[15rem]"
						/>
						{isSearchShown && (
							<ul className="flex flex-col gap-y-4  min-h-7 max-h-[60vh] overflow-y-auto absolute min-w-full w-max max-w-[18rem] bg-white top-[calc(100%+0.25rem)] z-10 left-0 p-4 border border-border-light rounded shadow-search">
								{/* <span className="absolute left-8 -top-4 border-[0.5em] border-transparent border-b-white"></span> */}
								{isSearchPending && <Spinner isUser={true} size="sm" />}
								{/* todo fix error handler  */}

								{/* hints */}
								{!isSearchPending && isSearchError && <li className="text-xs text-center text-text-light">{searchError}</li>}
								{!isSearchPending && !searchData.users.length && !searchData.articles.length && <li className="text-xs text-center text-text-light">No results found</li>}

								{/* users - works in home page only */}
								{!isSearchPending && !isSearchError && !!searchData.users.length && <li className="pb-2 text-sm tracking-widest uppercase border-b border-border-light text-text-light">People</li>}
								{!isSearchPending &&
									!isSearchError &&
									!!searchData.users.length &&
									searchData.users.map((user: any) => (
										<li key={user._id}>
											<Link to={`/${user._id}`} className="flex items-center w-full gap-x-2">
												<img className="h-6 rounded-full" src={user?.avatar || profilePic} alt="Author avatar" />
												<span className="text-sm text-text-dark">{user?.name || user?.username}</span>
											</Link>
										</li>
									))}
								{/* articles - works in profile page only */}
								{!isSearchPending && !isSearchError && !!searchData.articles.length && (
									<li className="pb-2 text-sm tracking-widest uppercase border-b border-border-light text-text-light">Articles</li>
								)}
								{!isSearchPending &&
									!isSearchError &&
									!!searchData.articles.length &&
									searchData.articles.map((article: any) => (
										<li key={article._id}>
											<Link to={`/${article.ownedBy}/${article._id}`} className="flex flex-col w-full gap-y-2">
												<span className="text-sm text-text-dark">{getShortArticleTitle(article?.title)}</span>
												<span className="text-xs text-text-light">{getLocalTime(article?.createdAt)}</span>
											</Link>
										</li>
									))}
							</ul>
						)}
					</li>
				)}
			</ul>

			<ul className="relative flex items-center gap-x-6">
				{!isNewStoryRoute && (
					<li>
						<Link to="/new-story" className="flex items-center gap-x-2 group/write">
							<Edit className="w-6 h-6 transition-all text-text-light group-hover/write:text-text-dark" />
							<span className="text-sm transition-all text-text-light group-hover/write:text-text-dark">Write</span>
						</Link>
					</li>
				)}

				{isNewStoryRoute && (
					<li>
						<button type="submit" form="publishNewStory" className=" hover:bg-opacity-90 transition-all text-sm rounded-[1em] px-4 py-1 font-normal text-white bg-green">
							Publish
						</button>
					</li>
				)}

				<li className="flex">
					<button ref={avatar} type="button" onClick={() => setIsMenuShown(!isMenuShown)} className="cursor-pointer opacity-80 hover:opacity-100">
						<img src={state.user.avatar || profilePic} alt="avatar" className="block h-8 transition-all rounded-full pointer-events-none" />
					</button>
				</li>

				{isMenuShown && (
					<div className="absolute right-0 bg-white rounded top-[calc(100%+0.5em)] border-line shadow-menu text-sm min-w-60 py-2 z-[1]">
						<ul>
							<li>
								<Link to={"/" + state.user._id} className="flex items-center px-6 py-2 gap-x-4 group/profile">
									<Profile className="w-6 h-6 transition-all text-text-light group-hover/profile:text-text-dark" />
									<span className="text-sm transition-all text-text-light group-hover/profile:text-text-dark">Profile</span>
								</Link>
							</li>
						</ul>
						<hr className="h-[1px] pt-2 bg-transparent border-t-border-light" />
						<ul>
							<li>
								<Link to={"/" + state.user._id + "/settings"} className="flex items-center px-6 py-2 gap-x-4 group/profile">
									<span className="text-sm transition-all text-text-light group-hover/profile:text-text-dark">Settings</span>
								</Link>
							</li>
						</ul>
						<hr className="h-[1px] pt-2 bg-transparent border-t-border-light" />

						<button type="button" className="w-full px-6 py-2 text-start group/signout" onClick={handleLogout}>
							<span className="text-sm transition-all pointer-events-none text-text-light group-hover/signout:text-text-dark">Sign out</span>
							<br />
							<span className="text-xs transition-all pointer-events-none text-text-light">{state.user.email}</span>
						</button>
					</div>
				)}
			</ul>
		</nav>
	);
}

export default UserNav;
