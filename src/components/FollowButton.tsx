import cx from "classnames";
import { cookies } from "../utils";
import { useEffect, useRef, useState } from "react";
type USER = {
	_id: string;
	followers: string[];
	following: string[];
};
const FollowButton = ({ className = "", onClick, relatedUser, loggedUser, profileUrl }: { relatedUser; loggedUser: USER; profileUrl: string; className?: string; onClick?: () => void }) => {
	const [type, setType] = useState("");
	const loggedUserId = cookies.get("userId");
	const ref = useRef(null);

	useEffect(() => {
		console.log({ ref, relatedUser, loggedUserId, profileUrl, loggedUser });
		if (relatedUser.notReady && ref?.current?.previousElementSibling?.href) {
			relatedUser._id = ref.current.previousElementSibling.href.split("/").pop();
		}
		if (loggedUser) {
			if (loggedUser.following.includes(relatedUser._id)) setType("unfollow");
			else setType("follow");
		}
	}, [ref, loggedUser, relatedUser, loggedUserId, profileUrl]);

	if (!loggedUserId || !loggedUser) return ""; // non-user can't follow
	if (relatedUser._id == loggedUser._id) return ""; // can't follow yourself
	// if (profileUrl.includes(`/${loggedUserId}/following`)) setType("unfollow"); // if it's my profile following section -- makes infinie loop

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
			if (onClick) onClick({ increase: true });
		} else {
			setType("follow");
			if (onClick) onClick({ increase: false });
		}
	};

	return (
		<button ref={ref} onClick={handleBtn} type="button" className={btnClasses()}>
			{type == "follow" ? "Follow" : "Following"}
		</button>
	);
};
export default FollowButton;
