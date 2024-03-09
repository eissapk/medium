import cx from "classnames";
import { cap } from "../utils";
import { useEffect, useState } from "react";

// relatedUser: data of the user block that wraps this button (includes id, etc)
// loggedInUserId: id of the current logged in user
// profileId: id of the current profile page
// profileUrl: url of the current profile page
// type: follow or unfollow (following)
const FollowButton = ({ className = "", relatedUser, loggedInUserId, profileId, profileUrl }) => {
	const loggedInUser = JSON.parse(localStorage.getItem("user") as string);
	const [type, setType] = useState("follow");
	const handleClasses = () => {
		return cx("flex px-4 py-2 text-sm transition-all rounded-full opacity-80 hover:opacity-100", {
			"border text-green border-green": type !== "follow",
			"bg-green text-white": type === "follow",
			[className]: className,
		});
	};

	useEffect(() => {
		// already following, show unfollow
		if (profileUrl.includes(`/${loggedInUserId}/following`)) setType("unfollow");
		// already following, show unfollow
		if (loggedInUser.following.includes(relatedUser._id)) setType("unfollow");
	}, [relatedUser, profileUrl, loggedInUserId, loggedInUser]);

	async function toggleBtn() {
		if (!loggedInUserId) return;

		const response = await fetch(`/api/user/${loggedInUserId}/${type}/${relatedUser._id}`, {
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		});

		const json = await response.json();
		if (json.error) {
			const error = new Error(json.message);
			error.code = response.status;
			throw error;
		}
		console.log(json);

		if (type == "follow") setType("unfollow");
		else setType("follow");
	}
	// todo: check why button label is not changed immediately when clicking follow or unfollow

	if (!loggedInUserId) return ""; // non-user can't follow
	if (relatedUser._id == loggedInUserId) return ""; // can't follow yourself

	return (
		<>
			<button onClick={toggleBtn} type="button" className={handleClasses()}>
				{cap(type)}
			</button>
		</>
	);
};
export default FollowButton;
