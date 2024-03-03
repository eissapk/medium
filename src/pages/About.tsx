import { Link } from "react-router-dom";
import { Twitter } from "../assets/icons";
import { getLocalTime, cap } from "../utils";

const linksArr = [
	{ url: "/me/followers", label: "Followers", namespace: "followers" },
	{ url: "/me/following", label: "Following", namespace: "following" },
];
//  todo: check if iam the user or not (1. iam the user 2. iam not the user and logged in 3. not logged in and not the user)
const user = JSON.parse(localStorage.getItem("user") as string) || {};
// user.bio = "Editor of INSURGE intelligence and Return of the Reich";
// user.socialLinks = [{ url: "https://twitter.com/insurge", namespace: "twitter" }];

function Icon({ name, ...props }) {
	switch (name) {
		case "twitter":
			return <Twitter {...props} />;
	}
}

function About() {
	return (
		<div>
			{/* bio */}
			{user.bio ? <p className="text-sm text-text-light">{user.bio}</p> : <p className="text-sm text-text-light">Member since {getLocalTime(user.createdAt, "short")}</p>}

			{/* following/followers */}
			<ul className="flex my-6">
				{linksArr.map((item, index) => (
					<li key={index}>
						<Link to={item.url} className="text-sm transition-all text-green opacity-80 hover:opacity-100">
							{user[item.namespace]} {item.label}
						</Link>
						{index == 0 && <span className="mx-4 text-sm text-text-dark">·</span>}
					</li>
				))}
			</ul>

			{/* social links */}
			{user.socialLinks.length ? (
				<ul className="flex gap-x-4">
					<li className="text-sm text-text-dark">Connect with {cap(user.name || user.email.split("@")[0])}</li>
					{user.socialLinks.map((item, index) => (
						<li key={index}>
							<a href={item.url} target="_blank" className="text-black-900">
								<Icon name={item.namespace} className="w-6 h-6 pointer-events-none fill-black-900" />
							</a>
						</li>
					))}
				</ul>
			) : (
				""
			)}
		</div>
	);
}

export default About;
