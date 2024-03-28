import { Link } from "react-router-dom";
import { Logo } from "../assets/icons";
const NonUserNav = () => {
	return (
		<nav className="flex flex-col justify-between py-6 sm:flex-row gap-y-5">
			<a href="/">
				<Logo className="h-6" />
			</a>

			<ul className="flex justify-end gap-x-5">
				<li>
					<Link to="/login" className="text-sm font-normal transition-all hover:text-black-200 text-black-100">
						Sign in
					</Link>
				</li>
				<li>
					<Link to="/signup" className=" hover:bg-black-900 transition-all text-sm rounded-[1em] px-4 py-2 font-normal text-white bg-black-200">
						Get started
					</Link>
				</li>
			</ul>
		</nav>
	);
};
export default NonUserNav;
