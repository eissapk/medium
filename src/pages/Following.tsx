import { cap, cookies, getNameFromEmail } from "../utils";
import profilePic from "../assets/profile-pic.webp";
import { useLocation, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import cx from "classnames";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/Spinner";
import FollowButton from "../components/FollowButton";

function Following() {
	const location = useLocation();
	const [loggedUser, setLoggedUser] = useState(null);
	const { user } = useOutletContext() as { user: any }; // this is the user of opened profile not the user related to follow button block element, so be careful
	const {
		isPending,
		error,
		data: followingArr,
		isError,
	}: // refetch,
	{
		isPending: boolean;
		error: any;
		data: any;
		isError: boolean;
	} = useQuery({
		queryKey: ["following", user._id],
		queryFn: ({ signal }) => loadFollowing({ userId: user._id, signal }),
		// enabled: false, // for better performance
	});

	useEffect(() => {
		// console.log(user._id);
		async function init() {
			const loggedUserId = cookies.get("userId");
			if (loggedUserId) {
				const loggedUserData = await loadLoggedUser(loggedUserId);
				setLoggedUser(loggedUserData);
			}
			// if (user.following.length) refetch(); // fetch only if there are following -- for better performance
			// refetch(); // for better UX
		}
		init();
	}, [user]);

	if (isError) {
		const err: any = new Error(error.message);
		err.code = error.code;
		throw err;
	}

	return (
		<div>
			<h1 className="text-[2.6rem] font-medium text-text-dark mb-5">{followingArr?.length} Following</h1>

			{!!user.following.length && (
				<ul className="flex flex-col gap-y-2">
					{isPending && <Spinner isUser={true} />}
					{!isPending &&
						!isError &&
						followingArr.map((item: any, index: number) => (
							<li key={item._id} className={cx("flex items-center justify-between", { "mt-5": index })}>
								<a href={`/${item._id}`} className="flex items-center gap-x-2">
									<img className="w-12 rounded-[50%]" src={item.avatar || profilePic} alt="avatar" />
									<span className="font-medium text-text-dark ps-2">{cap(item.name || getNameFromEmail(item.email))}</span>
								</a>
								<FollowButton relatedUser={item} loggedUser={loggedUser} profileUrl={location.pathname} />
							</li>
						))}
				</ul>
			)}
		</div>
	);
}

export default Following;

const loadFollowing = async ({ userId, signal }: { userId: string; signal: AbortSignal }) => {
	const response = await fetch(`/api/user/${userId}/following`, { headers: { "Content-Type": "application/json" }, signal });
	const json = await response.json();
	if (json.error) {
		const error: any = new Error(json.message);
		error.code = response.status;
		throw error;
	}

	await new Promise(r => setTimeout(r, 500)); // for testing
	// console.log("loadFollowing:", json);

	return json.data;
};

const loadLoggedUser = async (id: string) => {
	const response = await fetch("/api/user/" + id, { headers: { "Content-Type": "application/json" } });
	const json = await response.json();
	if (json.error) {
		const error: any = new Error(json.message);
		error.code = response.status;
		throw error;
	}
	await new Promise(r => setTimeout(r, 500)); // for testing
	// console.log("loadLoggedUser", json);
	return json.data;
};
