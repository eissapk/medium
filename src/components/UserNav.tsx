import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { useLogout } from "../hooks/useLogout";
import { Link } from "react-router-dom";
import { Profile, Edit, LogoMini, Search } from "../assets/icons";
import { useAuthContext } from "../hooks/useAuthContext";

function UserNav() {
	const navigate = useNavigate();
	const { state } = useAuthContext();
	const { logout } = useLogout();
	const { pathname } = useLocation();
	const avatar = useRef();

	const handleMenuClick = e => {
		if (e.target !== avatar.current) setIsShown(false);
	};

	useEffect(() => {
		if (pathname === "/new-story") setIsNewStoryRoute(true);
		else setIsNewStoryRoute(false);
		document.body.addEventListener("click", handleMenuClick);
		return () => document.body.removeEventListener("click", handleMenuClick);
	}, [pathname]);

	const [isShown, setIsShown] = useState(false);
	const [isNewStoryRoute, setIsNewStoryRoute] = useState(false);

	const handleLogout = () => {
		logout();
		navigate("/");
	};
	return (
		<nav className="flex flex-col items-center justify-between px-6 py-2 bg-white gap-y-5 sm:flex-row lg:px-0">
			<ul className="flex items-center gap-x-5 sm:self-start">
				<li>
					<Link to="/">
						<LogoMini className="h-6 " />
					</Link>
				</li>

				<li className="rounded-[1.25rem] bg-input flex items-center justify-items-center">
					<Search className="absolute w-6 h-6 pointer-events-none ms-4 text-text-light" />
					<input type="search" placeholder="Search" className="outline-none text-sm placeholder:text-text-light min-h-10 p-2.5 ps-12 bg-transparent min-w-[15rem]" />
				</li>
			</ul>
			<ul className="flex items-center justify-end px-2 gap-x-6 sm:self-end">
				{!isNewStoryRoute && (
					<li>
						<Link to="/new-story" className="flex items-center gap-x-2 group/write">
							<Edit className="w-6 h-6 transition-all text-text-light group-hover/write:text-text-dark" />
							<span className="text-sm transition-all text-text-light group-hover/write:text-text-dark">Write</span>
						</Link>
					</li>
				)}

				{isNewStoryRoute && (
					<button type="button" className=" hover:bg-opacity-90 transition-all text-sm rounded-[1em] px-4 py-1 font-normal text-white bg-green">
						Publish
					</button>
				)}

				<li className="relative">
					<img
						ref={avatar}
						src={state.user.avatar || `/api/assets/images/profile-pic.png`}
						alt="avatar"
						onClick={() => setIsShown(!isShown)}
						className="block h-8 transition-all rounded-full cursor-pointer opacity-80 hover:opacity-100"
					/>
					{isShown && (
						<ul className="absolute right-0 bg-white rounded top-[calc(100%+0.5em)] border-line shadow-menu text-sm min-w-60 py-2">
							<ul>
								<li>
									<Link to="/me" className="flex items-center px-6 py-2 gap-x-4 group/profile">
										<Profile className="w-6 h-6 transition-all text-text-light group-hover/profile:text-text-dark" />
										<span className="text-sm transition-all text-text-light group-hover/profile:text-text-dark">Profile</span>
									</Link>
								</li>
							</ul>
							<hr className="h-[1px] pt-2 bg-transparent border-t-border-light" />
							<ul>
								<li>
									<Link to="/me/settings" className="flex items-center px-6 py-2 gap-x-4 group/profile">
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
						</ul>
					)}
				</li>
			</ul>
		</nav>
	);
}

export default UserNav;
