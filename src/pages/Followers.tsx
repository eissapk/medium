import { cap, cookies, getNameFromEmail } from "../utils";
import profilePic from "../assets/profile-pic.webp";
import { useLocation, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import cx from "classnames";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/Spinner";
import FollowButton from "../components/FollowButton";
// import { useProfileContext } from "../hooks/useProfileContext";
// import { SET_CURRENT_PROFILE } from "../utils/types";

function Followers() {
	const location = useLocation();
	const [loggedUser, setLoggedUser] = useState(null);
	const { user, cb } = useOutletContext(); // this is the user of opened profile not the user related to follow button block element, so be careful
	// const { state, dispatch } = useProfileContext();
	const {
		isPending,
		error,
		data: followersArr,
		isError,
		// refetch,
	} = useQuery({
		queryKey: ["followers", user._id],
		queryFn: ({ signal }) => loadFollowers({ userId: user._id, signal }),
		// enabled: false, // for better performance
	});

	useEffect(() => {
		// console.log(user._id);
		if (followersArr) cb(followersArr); // todo: invoke cb on each fetch of useQuery, currently it needs to fetch twice to get real followers arr
		async function init() {
			// this makes a bug by react -- can't update compoennt while rendering another,etc
			const loggedUserId = cookies.get("userId");
			if (loggedUserId) {
				const loggedUserData = await loadLoggedUser(loggedUserId);
				setLoggedUser(loggedUserData);
			}
			// if (user.followers.length) refetch(); // fetch only if there are followers -- for better performance
			// refetch(); // for better UX
		}
		init();
	}, [user, followersArr, cb]);

	if (isError) {
		const err = new Error(error.message);
		err.code = error.code;
		throw err;
	}

	return (
		<div>
			<h1 className="text-[2.6rem] font-medium text-text-dark mb-5">{followersArr?.length} Followers</h1>

			<ul className="flex flex-col gap-y-2">
				{isPending && <Spinner isUser={true} />}
				{!isPending &&
					followersArr.map((item, index) => (
						<li key={item._id} className={cx("flex items-center justify-between", { "mt-5": index })}>
							<a href={`/${item._id}`} className="flex items-center gap-x-2">
								<img className="w-12 rounded-[50%]" src={item.avatar || profilePic} alt="avatar" />
								<span className="font-medium text-text-dark ps-2">{cap(item.name || getNameFromEmail(item.email))}</span>
							</a>
							<FollowButton relatedUser={item} loggedUser={loggedUser} profileUrl={location.pathname} />
						</li>
					))}
			</ul>
		</div>
	);
}

export default Followers;

const loadFollowers = async ({ userId, signal }: { userId: string; signal: AbortSignal }) => {
	const response = await fetch(`/api/user/${userId}/followers`, { headers: { "Content-Type": "application/json" }, signal });
	const json = await response.json();
	if (json.error) {
		const error = new Error(json.message);
		error.code = response.status;
		throw error;
	}

	await new Promise(r => setTimeout(r, 500)); // for testing
	// console.log("loadFollowers:", json);

	return json.data;
};

const loadLoggedUser = async (id: string) => {
	const response = await fetch("/api/user/" + id, { headers: { "Content-Type": "application/json" } });
	const json = await response.json();
	if (json.error) {
		const error: { code: number; message: string } = new Error(json.message);
		error.code = response.status;
		throw error;
	}
	await new Promise(r => setTimeout(r, 500)); // for testing
	// console.log("loadLoggedUser", json);
	return json.data;
};
