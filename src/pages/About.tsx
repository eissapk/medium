import { Link } from "react-router-dom";

function About() {
	return (
		<div>
			<p className="bio">Editor of INSURGE intelligence and Return of the Reich</p>
			<ul>
				<li>
					<Link to="/me/followers">27K Followers</Link>
				</li>
				<li>
					<Link to="/me/following">1.6K Following</Link>
				</li>
			</ul>
			<ul className="socialLinks">
				<li>
					Connect with Eissa saber
					<a href="https://x.com/eissa">
						<span>twitter icon</span>
					</a>
					<a href="https://linkedin.com/eissa">
						<span>linkedin icon</span>
					</a>
				</li>
			</ul>
		</div>
	);
}

export default About;
