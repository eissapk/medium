import { Outlet, Link, NavLink, json, defer, Await, useLoaderData } from "react-router-dom";
import { cap } from "../utils";
import { Suspense, useEffect, useState } from "react";

//  todo: check if iam the user or not (1. iam the user 2. iam not the user and logged in 3. not logged in and not the user)
const user = JSON.parse(localStorage.getItem("user")!) || {};

function ProfileLayout() {
	const { user: userData } = useLoaderData("userId");
	const [isLoggedInUser, setIsLoggedInUser] = useState(false);

	useEffect(() => {
		// if (params.userId === user._id) {
		// 	setIsLoggedInUser(true);
		// }
	}, []);

	function activeRoute({ isActive }) {
		let classes = "pb-[calc(1rem+2px)] text-sm transition-all text-text-light hover:text-black-100";
		if (isActive) classes += " border-b border-black-100";
		return classes;
	}
	const linksArr = [
		{ url: "/" + user._id, label: "Home" },
		{ url: "/" + user._id + "/about", label: "About" },
		{ url: "/" + user._id + "/followers", label: "Followers" },
		{ url: "/" + user._id + "/following", label: "Following" },
	];
	return (
		<main className="px-4">
			<div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] mx-auto max-w-max gap-x-20">
				{/* left side */}
				<div className="pt-10">
					<div className="pb-8">
						<div className="flex justify-between">
							<h1 className="text-[2.6rem] text-black-200 font-medium">{cap(user.name || user.email.split("@")[0])}</h1>
							{/* todo: check if current profile route === current logged in user then hide cta and vice versa */}
							<button type="button" className="flex px-4 py-2 mt-5 text-sm transition-all border rounded-full md:hidden opacity-80 hover:opacity-100 text-green border-green">
								{/* Follow */}
								Following
							</button>
						</div>

						<ul className="flex pt-10 pb-4 border-b gap-x-8 border-border-light">
							{linksArr.map((item, index) => (
								<li key={index}>
									<NavLink end={item.url === "/" + user._id} to={item.url} className={activeRoute}>
										{item.label}
									</NavLink>
								</li>
							))}
						</ul>
					</div>

					<div>
						<Suspense fallback={<p>loading user...</p>}>
							<Await resolve={userData}>{e => <Outlet />}</Await>
						</Suspense>
					</div>
				</div>

				{/* right side */}
				<div className="hidden pt-10 ps-10 border-s border-border-light md:block">
					{/* avatar */}
					<Link to={"/" + user._id} className="flex flex-col mb-4">
						<img src={user.avatar || "/api/assets/images/profile-pic.png"} alt="avatar" className="w-20 rounded-full" />
					</Link>

					{/* name */}
					<p className="mb-1 font-medium text-text-dark">{cap(user.name || user.email.split("@")[0])}</p>

					{/* followers */}
					<Link to={"/" + user._id + "/followers"} className="transition-all text-text-light hover:text-black-200">
						{user.followers} Followers
					</Link>

					{/* title */}
					{/* {user.title && <p className="text-sm text-text-light">{user.title}</p>} */}
					<p className="mt-3 text-sm text-text-light">I love to learn stuff then talk about it.</p>

					{/* todo: check if current profile route === current logged in user then hide cta and vice versa */}
					{/* cta */}
					<button type="button" className="flex px-4 py-2 mt-5 text-sm transition-all border rounded-full opacity-80 hover:opacity-100 text-green border-green">
						{/* Follow */}
						Following
					</button>
				</div>
			</div>
		</main>
	);
}

export default ProfileLayout;
const loadUser = async id => {
	const response = await fetch("/api/user/" + id, { headers: { "Content-Type": "application/json" } });
	if (!response.ok) {
		throw json({ message: "Couldn't fetch user data!", status: 500 });
	}
	if (response.error) {
		throw json({ message: error.message, status: response.status });
	}
	const data = await response.json();
	await new Promise(r => setTimeout(r, 2000)); // for testing
	console.log(data);

	return data;
};

export const loader = async ({ params }) => {
	const { userId } = params;
	return defer({ user: loadUser(userId) });
};
