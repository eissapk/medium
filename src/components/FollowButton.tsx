import cx from "classnames";
import { cap, cookies } from "../utils";
import { useEffect, useState } from "react";
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
	profileId,
	profileUrl,
}: {
	relatedUser: USER;
	loggedUser: USER;
	profileId: string;
	profileUrl: string;
	className?: string;
	onClick?: () => void;
}) => {
	const [type, setType] = useState("follow");
	const loggedUserId = cookies.get("userId");

	console.log({ relatedUser, loggedUserId, profileId, profileUrl, loggedUser });

	useEffect(() => {
		if (loggedUser.following.includes(relatedUser._id)) setType("unfollow");
		else setType("follow");
	}, []);

	if (!loggedUserId) return ""; // non-user can't follow
	if (relatedUser._id == loggedUserId) return ""; // can't follow yourself
	if (profileUrl.includes(`/${loggedUserId}/following`)) setType("unfollow"); // if it's my profile following section

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
			const error = new Error(json.message);
			error.code = response.status;
			throw error;
		}
		console.log("handleBtn", json);
		if (type == "follow") {
			setType("unfollow");
			onClick({ increase: true });
		} else {
			setType("follow");
			onClick({ increase: false });
		}
	};

	return (
		<button onClick={handleBtn} type="button" className={btnClasses()}>
			{cap(type)}
		</button>
	);
};
export default FollowButton;
