import { cap } from "../utils";
import { useOutletContext } from "react-router-dom";
import { profilePic } from "../assets";

function SettingsOptions() {
	const { user, editProfile } = useOutletContext() as { user: any; editProfile: (type: string, title: string) => void };

	return (
		<>
			<div>
				<button type="button" className="flex justify-between w-full py-2" onClick={() => editProfile("email", "Email address")}>
					<span className="text-sm text-text-dark">Email address</span>
					<span className="text-sm text-text-light">{user.email}</span>
				</button>
			</div>
			<div>
				<button type="button" className="flex justify-between w-full py-2" onClick={() => editProfile("password", "Password")}>
					<span className="text-sm text-text-dark">Password</span>
					<span className="text-sm text-text-light">*******</span>
				</button>
			</div>
			<div>
				<button type="button" className="flex justify-between w-full py-2" onClick={() => editProfile("username", "Username and subdomain")}>
					<span className="text-sm text-text-dark">Username and subdomain</span>
					<span className="text-sm text-text-light">{user.username}</span>
				</button>
			</div>
			<div>
				<button type="button" className="flex justify-between w-full py-2" onClick={() => editProfile("info", "Profile information")}>
					<span className="flex flex-col gap-y-2 text-start">
						<span className="text-sm text-text-dark">Profile information</span>
						<span className="text-xs text-text-light">Edit your photo, name, bio, etc.</span>
					</span>
					<span className="flex items-center gap-x-3">
						<span className="text-sm text-text-light">{cap(user.name || user.username)}</span>
						<img className="h-6 rounded-full" src={user.avatar || profilePic} alt="avatar" />
					</span>
				</button>
			</div>
		</>
	);
}

export default SettingsOptions;
