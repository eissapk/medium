import { Link, useOutletContext } from "react-router-dom";
import { Twitter } from "../assets/icons";
import { getLocalTime, cap, getNameFromEmail } from "../utils";
import { useEffect, useState } from "react";

const linksArr = [
	{ url: "/{{userId}}/followers", label: "Followers", namespace: "followers" },
	{ url: "/{{userId}}/following", label: "Following", namespace: "following" },
];

function Icon({ name, ...props }: any) {
	switch (name) {
		case "twitter":
			return <Twitter {...props} />;
	}
}

function About() {
	const { user } = useOutletContext() as { user: any };
	// user.bio = "Editor of INSURGE intelligence and Return of the Reich";
	// user.socialLinks = [{ url: "https://twitter.com/insurge", namespace: "twitter" }];
	const [links, setLinks] = useState(linksArr);

	useEffect(() => {
		setLinks(linksArr.map(link => ({ ...link, url: link.url.replace(/{{userId}}/g, user._id) })));
	}, [user]);

	return (
		<div>
			{/* bio */}
			{user.bio ? <p className="text-sm text-text-light">{user.bio}</p> : <p className="text-sm text-text-light">Member since {getLocalTime(user.createdAt, "short")}</p>}

			{/* following/followers */}
			<ul className="flex my-6">
				{links.map((item, index) => (
					<li key={index}>
						<Link to={item.url} className="text-sm transition-all text-green opacity-80 hover:opacity-100">
							{user[item.namespace].length} {item.label}
						</Link>
						{index == 0 && <span className="mx-4 text-sm text-text-dark">·</span>}
					</li>
				))}
			</ul>

			{/* social links */}
			{user.socialLinks.length ? (
				<ul className="flex gap-x-4">
					<li className="text-sm text-text-dark">Connect with {cap(user.name || getNameFromEmail(user.email))}</li>
					{user.socialLinks.map((item: any, index: number) => (
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
