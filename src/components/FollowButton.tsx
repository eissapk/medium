import cx from "classnames";
import { cookies, fetchAPI } from "../utils";
import { useEffect, useState } from "react";
import { useProfileContext } from "../hooks/useProfileContext";
import { SET_LOGGED_PROFILE, SET_CURRENT_PROFILE } from "../utils/types";
type USER = {
	_id: string;
	followers: string[];
	following: string[];
};
const FollowButton = ({
	className = "",
	includeDot = false,
	alignDot = "left",
	isArticle = false,
	relatedUser,
	loggedUser,
	profileUrl,
}: {
	relatedUser: USER;
	loggedUser: USER | null;
	profileUrl: string;
	className?: string;
	isArticle?: boolean;
	includeDot?: boolean;
	alignDot?: string;
}) => {
	const { state, dispatch } = useProfileContext();
	const [type, setType] = useState("");
	const [isPending, setIsPending] = useState(false);
	const loggedUserId = cookies.get("userId");
	useEffect(() => {
		// console.log({ relatedUser, loggedUserId, profileUrl, loggedUser });

		if (!state.profile.logged) dispatch({ type: SET_LOGGED_PROFILE, payload: loggedUser });
		if (!state.profile.current && profileUrl.includes(relatedUser._id)) dispatch({ type: SET_CURRENT_PROFILE, payload: relatedUser });

		function init(user: USER) {
			if (user.following.includes(relatedUser._id)) setType("unfollow");
			else setType("follow");
		}

		if (loggedUser) {
			if (state.profile.logged) init(state.profile.logged);
			else init(loggedUser);
		}
	}, [state, dispatch, loggedUser, relatedUser, loggedUserId, profileUrl]);

	if (!loggedUserId || !loggedUser) return ""; // non-user can't follow
	if (relatedUser._id == loggedUser._id) return ""; // can't follow yourself

	const btnClasses = () => {
		if (isArticle) {
			return cx("flex transition-all text-green", {
				"opacity-80": !isPending,
				"hover:opacity-100": !isPending,
				"opacity-30": isPending,
				"hover:opacity-30": isPending,
				[className]: className,
			});
		}
		return cx("flex px-4 py-2 text-sm transition-all rounded-full", {
			"bg-green text-white": type == "follow",
			"border text-green border-green": type !== "follow",
			"opacity-80": !isPending,
			"hover:opacity-100": !isPending,
			"opacity-30": isPending,
			"hover:opacity-30": isPending,
			// "filter grayscale": isPending,
			[className]: className,
		});
	};

	const handleBtn = async () => {
		if (!loggedUserId || !loggedUser || !relatedUser) return;

		setIsPending(true);
		const response = await fetchAPI(`/api/user/${loggedUserId}/${type}/${relatedUser._id}`, { headers: { "Content-Type": "application/json" }, credentials: "include" });

		const json = await response.json();
		if (json.error) {
			setIsPending(false);
			const error: any = new Error(json.message);
			error.code = response.status;
			throw error;
		}
		// console.log("handleBtn response:", json);

		if (json.data.type == "follow") setType("unfollow");
		else setType("follow");

		dispatch({ type: SET_LOGGED_PROFILE, payload: json.data.user1 });
		if (profileUrl.includes(json.data.user2._id)) dispatch({ type: SET_CURRENT_PROFILE, payload: json.data.user2 });
		setIsPending(false);
	};

	return (
		<button onClick={handleBtn} type="button" className={btnClasses()}>
			{includeDot && alignDot == "left" && <span className="text-text-light pe-2">.</span>}
			{type == "follow" ? "Follow" : "Following"}
			{includeDot && alignDot == "right" && <span className="text-text-light ps-2">.</span>}
		</button>
	);
};
export default FollowButton;
