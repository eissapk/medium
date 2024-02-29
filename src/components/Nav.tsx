import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
const logged = true;
function Nav() {
	const { pathname } = useLocation();
	useEffect(() => {
		if (pathname === "/new-story") {
			setIsNewStoryRoute(true);
		} else {
			setIsNewStoryRoute(false);
		}
	}, [pathname]);

	const [isShown, setIsShown] = useState(false);
	const [isNewStoryRoute, setIsNewStoryRoute] = useState(false);

	return (
		<>
			{!logged && (
				<nav className=" bg-main">
					<Link to="/">logo</Link>

					<ul className="flex px-2 gap-x-2 justify-end">
						<li>
							<Link to="/login">Sign in</Link>
						</li>
						<li>
							<Link to="/signup" className="bg-black text-white">
								Get started
							</Link>
						</li>
					</ul>
				</nav>
			)}
			{logged && (
				<nav className=" bg-main">
					<ul className=" flex gap-x-2">
						<li>
							<Link to="/">logo</Link>
						</li>
						<li>
							<input type="search" placeholder="Search" />
						</li>
					</ul>

					<ul className="flex px-2 gap-x-2 justify-end">
						{!isNewStoryRoute && (
							<li>
								<Link to="/new-story">Write</Link>
							</li>
						)}

						{isNewStoryRoute && <button>Publish</button>}
						<li className="relative">
							<img src="" alt="avatar" onClick={() => setIsShown(!isShown)} />
							{isShown && (
								<ul className="absolute top-6 right-0 bg-white border-line rounded">
									<li>
										<Link to="/me">profile</Link>
									</li>
									<li>
										<Link to="/me/settings">settings</Link>
									</li>
									<button type="button" className="text-start" onClick={() => console.log("sign out")}>
										<span>Sign out</span>
										<span className="block text-xs">ei.....@gmail.com</span>
									</button>
								</ul>
							)}
						</li>
					</ul>
				</nav>
			)}
		</>
	);
}

export default Nav;
