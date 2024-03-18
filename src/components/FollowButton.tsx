import cx from "classnames";
import { cookies } from "../utils";
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
	onClick,
	relatedUser,
	loggedUser,
	profileUrl,
}: {
	relatedUser: USER;
	loggedUser: USER | null;
	profileUrl: string;
	className?: string;
	onClick?: ({ increase }: { increase: boolean }) => void;
}) => {
	const { state, dispatch } = useProfileContext();
	const [type, setType] = useState("");
	const loggedUserId = cookies.get("userId");
	useEffect(() => {
		console.log({ relatedUser, loggedUserId, profileUrl, loggedUser });

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
		return cx("flex px-4 py-2 text-sm transition-all rounded-full opacity-80 hover:opacity-100", {
			"bg-green text-white": type == "follow",
			"border text-green border-green": type !== "follow",
			[className]: className,
		});
	};

	const handleBtn = async () => {
		if (!loggedUserId || !loggedUser || !relatedUser) return;

		const response = await fetch(`/api/user/${loggedUserId}/${type}/${relatedUser._id}`, {
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		});

		const json = await response.json();
		if (json.error) {
			const error: any = new Error(json.message);
			error.code = response.status;
			throw error;
		}
		console.log("handleBtn response:", json);

		if (json.data.type == "follow") {
			setType("unfollow");
			if (onClick) onClick({ increase: true });
		} else {
			setType("follow");
			if (onClick) onClick({ increase: false });
		}
		dispatch({ type: SET_LOGGED_PROFILE, payload: json.data.user1 });
		if (profileUrl.includes(json.data.user2._id)) dispatch({ type: SET_CURRENT_PROFILE, payload: json.data.user2 });
	};

	return (
		<button onClick={handleBtn} type="button" className={btnClasses()}>
			{type == "follow" ? "Follow" : "Following"}
		</button>
	);
};
export default FollowButton;
