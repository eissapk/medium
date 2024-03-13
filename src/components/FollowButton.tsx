import cx from "classnames";
import { cookies } from "../utils";
import { useEffect, useState } from "react";
type USER = {
	_id: string;
	followers: string[];
	following: string[];
};
const FollowButton = ({ className = "", onClick, relatedUser, loggedUser, profileUrl }: { relatedUser; loggedUser: USER; profileUrl: string; className?: string; onClick?: () => void }) => {
	const [type, setType] = useState("");
	const loggedUserId = cookies.get("userId");
	// const ref = useRef(null);

	// todo: fix why navigating to other tabs like home,about,followers,following affter state of follow button on right-side column (so if it 's unfollow it become the opposite)
	useEffect(() => {
		console.log({ relatedUser, loggedUserId, profileUrl, loggedUser });

		(function () {
			const storedLoggedUser = JSON.parse(localStorage.getItem("user")!);
			if (!storedLoggedUser) localStorage.setItem("user", JSON.stringify(loggedUser));
		})();

		function init(user: USER) {
			if (user.following.includes(relatedUser._id)) setType("unfollow");
			else setType("follow");
		}

		if (loggedUser) {
			const storedLoggedUser = JSON.parse(localStorage.getItem("user")!);
			if (storedLoggedUser) {
				init(storedLoggedUser);
			} else {
				init(loggedUser);
			}
		}
	}, [loggedUser, relatedUser, loggedUserId, profileUrl]);

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
			const error = new Error(json.message);
			error.code = response.status;
			throw error;
		}
		//todo: fetch logged user each outlet switch and compare it with related user id only
		console.log("handleBtn response:", json);
		if (json.data.type == "follow") {
			localStorage.setItem("user", JSON.stringify(json.data.user1));
			setType("unfollow");
			if (onClick) onClick({ increase: true });
		} else {
			localStorage.setItem("user", JSON.stringify(json.data.user1));
			setType("follow");
			if (onClick) onClick({ increase: false });
		}
	};

	return (
		<button onClick={handleBtn} type="button" className={btnClasses()}>
			{type == "follow" ? "Follow" : "Following"}
		</button>
	);
};
export default FollowButton;
