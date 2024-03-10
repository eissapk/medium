import { cap, getNameFromEmail, cookies } from "../utils";
import profilePic from "../assets/profile-pic.webp";
import { useOutletContext, useLocation } from "react-router-dom";
import { useEffect } from "react";
import cx from "classnames";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/Spinner";
import FollowButton from "../components/FollowButton";

function Following() {
	const location = useLocation();
	const { user } = useOutletContext();
	const {
		isPending,
		error,
		data: followingArr,
		isError,
		refetch,
	} = useQuery({
		queryKey: ["following", user._id],
		queryFn: ({ signal }) => loadFollowing({ userId: user._id, signal }),
		enabled: false,
	});
	const loggedInUserId = cookies.get("userId");

	useEffect(() => {
		if (user.following.length) refetch(); // fetch only if there are following
	}, [user, refetch]);

	if (isError) {
		const err = new Error(error.message);
		err.code = error.code;
		throw err;
	}

	return (
		<div>
			<h1 className="text-[2.6rem] font-medium text-text-dark mb-5">{user.following.length} Following</h1>

			{!!user.following.length && (
				<ul className="flex flex-col gap-y-2">
					{isPending && <Spinner isUser={true} />}
					{!isPending &&
						!isError &&
						followingArr.data.map((item, index) => (
							<li key={item._id} className={cx("flex items-center justify-between", { "mt-5": index })}>
								<a href={`/${item._id}`} className="flex items-center gap-x-2">
									<img className="w-12 rounded-[50%]" src={item.avatar || profilePic} alt="avatar" />
									<span className="font-medium text-text-dark ps-2">{cap(item.name || getNameFromEmail(item.email))}</span>
								</a>

								{/* <FollowButton relatedUser={item} loggedInUserId={loggedInUserId} profileId={user._id} profileUrl={location.pathname} /> */}
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
		const error = new Error(json.message);
		error.code = response.status;
		throw error;
	}

	await new Promise(r => setTimeout(r, 500)); // for testing
	// console.log("loadFollowing:", json);

	return json;
};
