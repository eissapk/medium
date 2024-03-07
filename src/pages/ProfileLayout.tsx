import { Outlet, Link, NavLink, json, defer, Await, useLoaderData, useAsyncError } from "react-router-dom";
import { cap } from "../utils";
import { Suspense, useEffect, useState } from "react";

const linksArr = [
	{ url: "{{userId}}", label: "Home" },
	{ url: "{{userId}}" + "/about", label: "About" },
	{ url: "{{userId}}" + "/followers", label: "Followers" },
	{ url: "{{userId}}" + "/following", label: "Following" },
];
function ProfileLayout() {
	const [isLoggedInUser, setIsLoggedInUser] = useState(false);
	const { userData } = useLoaderData("userId");
	const [user, setUser] = useState(null);
	const [links, setLinks] = useState(linksArr);

	function activeRoute({ isActive }) {
		let classes = "pb-[calc(1rem+2px)] text-sm transition-all text-text-light hover:text-black-100";
		if (isActive) classes += " border-b border-black-100";
		return classes;
	}
	useEffect(() => {
		userData.then(json => {
			const arr = linksArr.map(item => ({ url: item.url.replace("{{userId}}", "/" + json.data._id), label: item.label }));
			setLinks(arr);
		});
	}, [userData]);
	return (
		<>
			<main className="px-4">
				<div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] mx-auto max-w-max gap-x-20">
					{/* left side */}
					<div className="pt-10">
						<div className="pb-8">
							<div className="flex justify-between">
								{user && <h1 className="text-[2.6rem] text-black-200 font-medium">{cap(user?.name || user?.email.split("@")[0])}</h1>}
								{!user && <h1 className="text-[2.6rem] text-black-200 font-medium">Loading..</h1>}

								<button type="button" className="flex px-4 py-2 mt-5 text-sm transition-all border rounded-full md:hidden opacity-80 hover:opacity-100 text-green border-green">
									{!user && "Loading.."}
									{user && "Following"}
								</button>
							</div>

							<ul className="flex pt-10 pb-4 border-b gap-x-8 border-border-light">
								{links.map((item, index) => (
									<li key={index}>
										<NavLink end={item?.url === "/" + user?._id} to={item.url} className={activeRoute}>
											{item?.label}
										</NavLink>
									</li>
								))}
							</ul>
						</div>

						<div>
							<Outlet />
							<Suspense fallback={<p>loading user...</p>}>
								{/* <Await resolve={userData}>{json => <Outlet user={json.data} />}</Await> */}
								<Await resolve={userData}>{json => <Outlet />}</Await>
							</Suspense>
						</div>
					</div>

					{/* right side */}
					<div className="hidden pt-10 ps-10 border-s border-border-light md:block">
						{/* avatar */}
						{!user && (
							<Link to={"."} className="flex flex-col mb-4">
								<img src={"/api/assets/images/profile-pic.png"} alt="avatar" className="w-20 rounded-full" />
							</Link>
						)}
						{user && (
							<Link to={"/" + user?._id} className="flex flex-col mb-4">
								<img src={user?.avatar || "/api/assets/images/profile-pic.png"} alt="avatar" className="w-20 rounded-full" />
							</Link>
						)}

						{/* name */}
						{!user && <p className="mb-1 font-medium text-text-dark">Loading..</p>}
						{user && <p className="mb-1 font-medium text-text-dark">{cap(user?.name || user?.email.split("@")[0])}</p>}

						{/* followers */}
						{!user && (
							<Link to={"."} className="transition-all text-text-light hover:text-black-200">
								Loading..
							</Link>
						)}
						{user && (
							<Link to={"/" + user._id + "/followers"} className="transition-all text-text-light hover:text-black-200">
								{user.followers} Followers
							</Link>
						)}

						{/* title */}
						{user?.title && <p className="text-sm text-text-light">{user.title}</p>}
						{/* <p className="mt-3 text-sm text-text-light">I love to learn stuff then talk about it.</p> */}

						{/* todo: check if current profile route === current logged in user then hide cta and vice versa */}
						{/* cta */}
						<button type="button" className="flex px-4 py-2 mt-5 text-sm transition-all border rounded-full opacity-80 hover:opacity-100 text-green border-green">
							{!user && "Loading.."}
							{user && "Following"}
						</button>
					</div>
				</div>
			</main>
		</>
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
	return defer({ userData: loadUser(userId) });
};
