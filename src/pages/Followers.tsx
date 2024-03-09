import { cap, getNameFromEmail } from "../utils";
import profilePic from "../assets/profile-pic.webp";
import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import cx from "classnames";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/Spinner";

function Followers() {
	const user = useOutletContext();
	const {
		isPending,
		error,
		data: followersArr,
		isError,
		refetch,
	} = useQuery({
		queryKey: ["followers", user._id],
		queryFn: ({ signal }) => loadFollowers({ userId: user._id, signal }),
		enabled: false,
	});

	useEffect(() => {
		console.log(user._id);

		if (user.followers.length) refetch(); // fetch only if there are followers
	}, [user, refetch]);

	if (isError) {
		const err = new Error(error.message);
		err.code = error.code;
		throw err;
	}

	return (
		<div>
			<h1 className="text-[2.6rem] font-medium text-text-dark mb-5">{user.followers.length} Followers</h1>

			{!!user.followers.length && (
				<ul className="flex flex-col gap-y-2">
					{isPending && <Spinner isUser={true} />}
					{!isPending &&
						!isError &&
						followersArr.data.map((item, index) => (
							<li key={item._id} className={cx("flex items-center justify-between", { "mt-5": index })}>
								<a href={`/${item._id}`} className="flex items-center gap-x-2">
									<img className="w-12 rounded-[50%]" src={item.avatar || profilePic} alt="avatar" />
									<span className="font-medium text-text-dark ps-2">{cap(item.name || getNameFromEmail(item.email))}</span>
								</a>
								{/* todo: check if user id is in followers array of current logged in user or not to show follow/unfollow button */}

								<button type="button" className="flex px-4 py-2 text-sm text-white transition-all rounded-full opacity-80 hover:opacity-100 bg-green">
									Follow
								</button>
							</li>
						))}
				</ul>
			)}
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
	console.log("loadFollowers:", json);

	return json;
};
