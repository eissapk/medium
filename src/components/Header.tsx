import { Link } from "react-router-dom";
import { Logo } from "../assets/animation";

function Header() {
	return (
		<header className="relative px-4 py-24 text-center border-b sm:text-start bg-yellow border-border-dark">
			<div className="mx-auto max-w-max">
				<h1 className="font-title mb-8 text-[4.3rem] md:text-[5.3rem] lg:text-[6.5rem]">Stay curious.</h1>
				<p className="text-[1.5rem] mb-12 ">
					Discover stories, thinking, and expertise <br /> from writers on any topic.
				</p>
				<Link to="/signup" className="hover:bg-black-900 transition-all rounded-[1.25em] px-10 py-2 text-xl font-normal text-white bg-black-200">
					Start reading
				</Link>
			</div>
			<Logo className="absolute bottom-0 right-0 hidden h-full lg:block homeAnimation" />
		</header>
	);
}

export default Header;
