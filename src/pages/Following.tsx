import { cap } from "../utils";
const user = JSON.parse(localStorage.getItem("user") as string) || {};
// todo: check if current url is == current user or different user
function Following() {
	return (
		<div>
			<h1 className="text-[2.6rem] font-medium text-text-dark">{user.following} Following</h1>

			<ul className="flex flex-col gap-y-2">
				<li className="flex items-center justify-between mt-5">
					<a href={`/${user.id}`} className="flex items-center gap-x-2">
						<img className="w-12 rounded-[50%]" src={user.avatar || "/api/assets/images/profile-pic.png"} alt="avatar" />
						<span className="font-medium text-text-dark ps-2">{cap(user.name || user.email.split("@")[0])}</span>
					</a>
					<button type="button" className="flex px-4 py-2 text-sm text-white transition-all rounded-full opacity-80 hover:opacity-100 bg-green">
						Follow
					</button>
				</li>
			</ul>
		</div>
	);
}

export default Following;
