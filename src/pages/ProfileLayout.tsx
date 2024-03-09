import { Outlet, Link, NavLink, defer, Await, useLoaderData, useParams, useLocation } from "react-router-dom";
import { cap, getNameFromEmail, cookies } from "../utils";
import { Suspense, useEffect, useState } from "react";
import FollowButton from "../components/FollowButton";
import Spinner from "../components/Spinner";
import profilePic from "../assets/profile-pic.webp";

const linksArr = [
	{ url: "/{{userId}}", label: "Home" },
	{ url: "/{{userId}}" + "/about", label: "About" },
	{ url: "/{{userId}}" + "/followers", label: "Followers" },
	{ url: "/{{userId}}" + "/following", label: "Following" },
];
function activeRoute({ isActive }) {
	let classes = "pb-[calc(1rem+2px)] text-sm transition-all text-text-light hover:text-black-100";
	if (isActive) classes += " border-b border-black-100";
	return classes;
}
const userNameClasses = "text-[2.6rem] text-black-200 font-medium";

function ProfileLayout() {
	const { userId } = useParams();
	const location = useLocation();
	const { userData } = useLoaderData();
	const [links, setLinks] = useState(linksArr);
	const loggedInUserId = cookies.get("userId");

	useEffect(() => {
		// update links based on current fetched user
		userData.then(json => setLinks(linksArr.map(link => ({ ...link, url: link.url.replace(/{{userId}}/g, json.data._id) }))));
	}, [userData, userId]);

	return (
		<main className="px-4">
			<div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] mx-auto max-w-max gap-x-20">
				{/* left side */}
				<div className="pt-10">
					<div className="pb-8">
						<div className="flex justify-between">
							<Suspense
								fallback={
									<Spinner className="w-[50%]" isLine={true}>
										<h1 className={`invisible ${userNameClasses}`}>Test</h1>
									</Spinner>
								}>
								<Await resolve={userData}>
									{user => (
										<>
											<h1 className={userNameClasses}>{cap(user.data?.name || getNameFromEmail(user.data?.email))}</h1>
											<FollowButton className="md:hidden" relatedUser={user.data} loggedInUserId={loggedInUserId} profileId={userId} profileUrl={location.pathname} />
										</>
									)}
								</Await>
							</Suspense>
						</div>

						<ul className="flex pt-10 pb-4 border-b gap-x-8 border-border-light">
							{links.map((item, index) => (
								<li key={index}>
									<NavLink end={index == 0} to={item.url} className={activeRoute}>
										{item?.label}
									</NavLink>
								</li>
							))}
						</ul>
					</div>

					<div>
						<Suspense fallback={<Spinner isArticle={true} />}>
							<Await resolve={userData}>{user => <Outlet context={user.data} />}</Await>
						</Suspense>
					</div>
				</div>

				{/* right side */}
				<div className="hidden pt-10 ps-10 border-s border-border-light md:block">
					<Suspense fallback={<Spinner isAvatar={true} />}>
						<Await resolve={userData}>
							{user => (
								<>
									{/* avatar */}
									<div className="flex flex-col mb-4">
										<img src={user.data?.avatar || profilePic} alt="avatar" className="w-20 rounded-full" />
									</div>

									{/* name */}
									<p className="mb-1 font-medium text-text-dark">{cap(user.data?.name || getNameFromEmail(user.data?.email))}</p>
									{/* followers */}
									<Link to={"/" + user.data?._id + "/followers"} className="transition-all text-text-light hover:text-black-200">
										{user.data.followers.length} Followers
									</Link>
									{/* title */}
									{user.data?.title && <p className="mt-3 text-sm text-text-light">{user.data?.title}</p>}
									{/* cta */}
									<FollowButton className="mt-2" relatedUser={user.data} loggedInUserId={loggedInUserId} profileId={userId} profileUrl={location.pathname} />
								</>
							)}
						</Await>
					</Suspense>
				</div>
			</div>
		</main>
	);
}

export default ProfileLayout;

const loadUser = async id => {
	const response = await fetch("/api/user/" + id, { headers: { "Content-Type": "application/json" } });
	const data = await response.json();

	if (data.error) {
		const error = new Error(data.message);
		error.code = response.status;
		throw error;
	}

	await new Promise(r => setTimeout(r, 500)); // for testing

	return data;
};

export const loader = async ({ params }: { params: { userId: string } }) => {
	const { userId } = params;
	return defer({ userData: loadUser(userId) });
};
