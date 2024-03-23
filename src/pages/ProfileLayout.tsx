import { Outlet, Link, NavLink, defer, Await, useLoaderData, useParams, useLocation } from "react-router-dom";
import { cap, getNameFromEmail, cookies, fetchAPI } from "../utils";
import { Suspense, useEffect, useState } from "react";
import FollowButton from "../components/FollowButton";
import Spinner from "../components/Spinner";
import profilePic from "../assets/profile-pic.webp";
import { useProfileContext } from "../hooks/useProfileContext";
import { SET_LOGGED_PROFILE, SET_CURRENT_PROFILE } from "../utils/types";

const linksArr = [
	{ url: "/{{userId}}", label: "Home" },
	{ url: "/{{userId}}" + "/about", label: "About" },
	{ url: "/{{userId}}" + "/followers", label: "Followers" },
	{ url: "/{{userId}}" + "/following", label: "Following" },
];
function activeRoute({ isActive }: { isActive: boolean }) {
	let classes = "pb-[calc(1rem+2px)] text-sm transition-all text-text-light hover:text-black-100";
	if (isActive) classes += " border-b border-black-100";
	return classes;
}
const userNameClasses = "text-[2.6rem] text-black-200 font-medium";

function ProfileLayout() {
	const { userId } = useParams();
	const location = useLocation();
	const { userData } = useLoaderData() as { userData: any };
	const [links, setLinks] = useState(linksArr);
	const { dispatch, state } = useProfileContext();

	useEffect(() => {
		// update links based on current fetched user
		userData.then(({ user, loggedUser }: { user: any; loggedUser: any }) => {
			dispatch({ type: SET_CURRENT_PROFILE, payload: user });
			dispatch({ type: SET_LOGGED_PROFILE, payload: loggedUser });
			setLinks(linksArr.map(link => ({ ...link, url: link.url.replace(/{{userId}}/g, user._id) })));
		});
	}, [userData, userId, dispatch]);

	return (
		<main className="px-4">
			<div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] mx-auto max-w-max gap-x-20">
				{/* left side */}
				<div className="pt-10">
					<div className="pb-8">
						<div className="flex items-center justify-between">
							<Suspense
								fallback={
									<Spinner className="w-[50%]" isLine={true}>
										<h1 className={`invisible ${userNameClasses}`}>Test</h1>
									</Spinner>
								}>
								<Await resolve={userData}>
									{({ user, loggedUser }) => (
										<>
											<h1 className={userNameClasses}>{cap(user.name || getNameFromEmail(user.email))}</h1>
											<FollowButton className="md:hidden" relatedUser={user} loggedUser={loggedUser} profileUrl={location.pathname} />
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
							<Await resolve={userData}>{({ user }) => <Outlet context={{ user }} />}</Await>
						</Suspense>
					</div>
				</div>

				{/* right side */}
				<div className="hidden pt-10 ps-10 border-s border-border-light md:block">
					<Suspense fallback={<Spinner isAvatar={true} />}>
						<Await resolve={userData}>
							{({ user, loggedUser }) => (
								<>
									{/* avatar */}
									<div className="flex flex-col mb-4">
										<img src={user?.avatar || profilePic} alt="avatar" className="w-20 rounded-full" />
									</div>

									{/* name */}
									<p className="mb-1 font-medium text-text-dark">{cap(user?.name || getNameFromEmail(user?.email))}</p>
									{/* followers */}
									<Link to={"/" + user?._id + "/followers"} className="transition-all text-text-light hover:text-black-200">
										{/* @ts-expect-error -- fix  */}
										{state?.profile?.current?.followers?.length || 0} Followers
									</Link>
									{/* title */}
									{user?.title && <p className="mt-3 text-sm text-text-light">{user?.title}</p>}
									{/* cta */}
									<FollowButton className="mt-2" relatedUser={user} loggedUser={loggedUser} profileUrl={location.pathname} />
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

const loadUser = async (id: string) => {
	const response = await fetchAPI("/api/user/" + id, { headers: { "Content-Type": "application/json" } });
	const json = await response.json();

	if (json.error) {
		const error: any = new Error(json.message);
		error.code = response.status;
		throw error;
	}
	// await new Promise(r => setTimeout(r, 500)); // for testing
	// console.log("loadUser:", json);
	return json.data;
};

const loadLoggedUser = async (id: string) => {
	const response = await fetchAPI("/api/user/" + id, { headers: { "Content-Type": "application/json" } });
	const json = await response.json();
	if (json.error) {
		const error: any = new Error(json.message);
		error.code = response.status;
		throw error;
	}
	// await new Promise(r => setTimeout(r, 500)); // for testing
	// console.log("loadLoggedUser", json);
	return json.data;
};

const loadUsers = async ({ userId, loggedUserId }: { userId: string; loggedUserId: string }) => {
	const loggedUser = loggedUserId && (await loadLoggedUser(loggedUserId));
	const user = await loadUser(userId);
	return { loggedUser, user };
};

export const loader = async ({ params }: any) => {
	// export const loader = async ({ params }: { params: { userId: string } }) => {
	const { userId } = params;
	const loggedUserId = cookies.get("userId");
	return defer({ userData: loadUsers({ userId, loggedUserId }) });
};
