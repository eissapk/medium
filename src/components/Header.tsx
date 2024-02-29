import { Link } from "react-router-dom";
function Header() {
	return (
		<header className=" bg-yellow text-text text-start">
			<h1>Stay curious.</h1>
			<p>Discover stories, thinking, and expertise from writers on any topic.</p>
			<Link to="/signup" className="bg-black text-white">
				Start reading
			</Link>
		</header>
	);
}

export default Header;
