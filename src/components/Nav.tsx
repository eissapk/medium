import { Link } from "react-router-dom";
function Nav() {
	return (
		<nav>
			<ul className=" flex gap-2 justify-center">
				<li>
					<Link to="/">home</Link>
				</li>
				<li>
					<Link to="about">about</Link>
				</li>
			</ul>
		</nav>
	);
}

export default Nav;
