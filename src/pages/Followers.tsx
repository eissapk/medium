import { cap, cookies, fetchAPI } from "../utils";
import profilePic from "../assets/profile-pic.webp";
import { useLocation, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import cx from "classnames";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/Spinner";
import FollowButton from "../components/FollowButton";
import { SET_CURRENT_PROFILE } from "../utils/types";
import { useProfileContext } from "../hooks/useProfileContext";

function Followers() {
	const ctx = useProfileContext();
	const location = useLocation();
	const [loggedUser, setLoggedUser] = useState(null);
	const { user } = useOutletContext() as { user: any }; // this is the user of opened profile not the user related to follow button block element, so be careful
	const {
		isPending,
		error,
		data: followersArr,
		isError,
	}: {
		isPending: boolean;
		error: any;
		data: any;
		isError: boolean;
	} = useQuery({
		queryKey: ["followers", user._id],
		queryFn: ({ signal }) => loadFollowers({ userId: user._id, signal }, ctx),
	});

	useEffect(() => {
		// console.log(user._id);
		async function init() {
			// this makes a bug by react -- can't update compoennt while rendering another,etc
			const loggedUserId = cookies.get("userId");
			if (loggedUserId) {
				const loggedUserData = await loadLoggedUser(loggedUserId);
				setLoggedUser(loggedUserData);
			}
		}
		init();
	}, [user, followersArr]);

	if (isError) {
		const err: any = new Error(error.message);
		err.code = error.code;
		throw err;
	}

	return (
		<div>
			<h1 className="text-[2.6rem] font-medium text-text-dark mb-5">{followersArr?.length} Followers</h1>

			<ul className="flex flex-col gap-y-2">
				{isPending && <Spinner isUser={true} />}
				{!isPending &&
					followersArr.map((item: any, index: number) => (
						<li key={item._id} className={cx("flex items-center justify-between", { "mt-5": index })}>
							<a href={`/${item._id}`} className="flex items-center gap-x-2">
								<img className="w-12 rounded-[50%]" src={item.avatar || profilePic} alt="avatar" />
								<span className="font-medium text-text-dark ps-2">{cap(item.name || item.username)}</span>
							</a>
							<FollowButton relatedUser={item} loggedUser={loggedUser} profileUrl={location.pathname} />
						</li>
					))}
			</ul>
		</div>
	);
}

export default Followers;

const loadFollowers = async ({ userId, signal }: { userId: string; signal: AbortSignal }, ctx: any) => {
	const response = await fetchAPI(`/api/user/${userId}/followers`, { headers: { "Content-Type": "application/json" }, signal });
	const json = await response.json();
	if (json.error) {
		const error: any = new Error(json.message);
		error.code = response.status;
		throw error;
	}

	// await new Promise(r => setTimeout(r, 500)); // for testing
	// console.log("loadFollowers:", json);
	// update current profile followers
	ctx.dispatch({ type: SET_CURRENT_PROFILE, payload: { ...ctx.state.profile.current, followers: json.data.map((item: any) => item._id) } });
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
