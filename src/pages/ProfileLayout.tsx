import { Outlet, Link, NavLink } from "react-router-dom";
const linksArr = [
	{ url: "/me", label: "Home" },
	{ url: "/me/about", label: "About" },
	{ url: "/me/followers", label: "Followers" },
	{ url: "/me/following", label: "Following" },
];

function ProfileLayout() {
	function activeRoute({ isActive }) {
		if (isActive) {
			return "pb-[calc(1rem+2px)] text-sm transition-all border-b border-black-100 text-text-light hover:text-black-100 ";
		}
		return "pb-[calc(1rem+2px)] text-sm transition-all text-text-light hover:text-black-100 ";
	}
	return (
		<main className="px-4 pt-10">
			<div className="flex justify-center mx-auto max-w-max gap-x-6">
				{/* left side */}
				<div>
					<div>
						<h1 className="text-[2.6rem] text-black-200 font-medium">Ahmed Hassanein</h1>
						<ul className="flex pt-10 pb-4 border-b gap-x-8 border-border-light">
							{linksArr.map((item, index) => (
								<li key={index}>
									<NavLink end={item.url === "/me"} to={item.url} className={activeRoute}>
										{item.label}
									</NavLink>
								</li>
							))}
						</ul>
					</div>

					<div>
						<Outlet />
					</div>
				</div>

				{/* right side */}
				<div>
					<Link to={"/me"}>
						<img src="" alt="avatar" />
						<h2>Name</h2>
					</Link>
					<Link to={"/me/followers"}>
						<p>27K Followers</p>
					</Link>
					<p>Editor of INSURGE intelligence and Return of the Reich</p>
					<button className="bg-main">Follow</button>
				</div>
			</div>
		</main>
	);
}

export default ProfileLayout;
