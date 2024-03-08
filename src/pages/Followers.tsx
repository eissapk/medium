import { cap, getNameFromEmail } from "../utils";
import profilePic from "../assets/profile-pic.webp";
import { useOutletContext, defer, useLoaderData, Await } from "react-router-dom";
import { Suspense, useEffect } from "react";

import Spinner from "../components/Spinner";
function Followers() {
	const user = useOutletContext();
	const { userFollowers } = useLoaderData();
	useEffect(() => {
		userFollowers.then(json => console.log(json));
	}, [userFollowers]);

	return (
		<div>
			<h1 className="text-[2.6rem] font-medium text-text-dark">{user.followers.length} Followers</h1>

			<Suspense fallback={<Spinner isArticle={true} />}>
				<Await resolve={userFollowers}>
					{json => (
						<ul className="flex flex-col gap-y-2">
							{json.data.map(item => (
								<li key={item._id} className="flex items-center justify-between mt-5">
									<a href={`/${item._id}`} className="flex items-center gap-x-2">
										<img className="w-12 rounded-[50%]" src={user.avatar || profilePic} alt="avatar" />
										<span className="font-medium text-text-dark ps-2">{cap(user.name || getNameFromEmail(user.email))}</span>
									</a>
									{/* todo: check if user id is in followers array of current logged in user or not to show follow/unfollow button */}
									<button type="button" className="flex px-4 py-2 text-sm text-white transition-all rounded-full opacity-80 hover:opacity-100 bg-green">
										Follow
									</button>
								</li>
							))}
						</ul>
					)}
				</Await>
			</Suspense>
		</div>
	);
}

export default Followers;

const loadFollowers = async (userId: string) => {
	// todo make endpoint to get array of all followres
	// dummy data
	await new Promise(r => setTimeout(r, 1000));
	return {
		data: [
			{
				_id: "65eb0caca5ca87836ce088ea",
				email: "eissapk44@gmail.com",
				password: "$2a$10$VE9EuvF61YJEM/XMCnseburzlj/b3hKYrsiXkXs5AlcpN9GQdq666",
				avatar: null,
				name: null,
				title: null,
				bio: null,
				socialLinks: [],
				articles: [],
				followers: [],
				following: [],
				createdAt: "2024-03-08T13:03:40.085Z",
				updatedAt: "2024-03-08T17:46:28.207Z",
				__v: 0,
			},
		],
	};
};

export const loader = async ({ params }: { params: { userId: string } }) => {
	const { userId } = params;
	return defer({ userFollowers: loadFollowers(userId) });
};
