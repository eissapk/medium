import { Link, useOutletContext } from "react-router-dom";
import { Facebook, Linkedin, Twitter } from "../assets/icons";
import { getLocalTime, cap } from "../utils";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const linksArr = [
	{ url: "/{{userId}}/followers", label: "Followers", namespace: "followers" },
	{ url: "/{{userId}}/following", label: "Following", namespace: "following" },
];

function Icon({ name, ...props }: any) {
	switch (name) {
		case "twitter":
			return <Twitter {...props} />;
		case "facebook":
			return <Facebook {...props} />;
		case "linkedin":
			return <Linkedin {...props} />;
	}
}

// filter only items with actual url
const getCleanSocialLinks = (arr: any[]): any[] => {
	const newArr: any[] = [];
	arr.forEach((item: any) => {
		if (item.url !== "") newArr.push(item);
	});
	return newArr;
};

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
			{user.bio ? (
				<Markdown className={"markdown text-sm text-text-light"} rehypePlugins={[rehypeRaw]}>
					{user.bio}
				</Markdown>
			) : (
				<p className="text-sm text-text-light">Member since {getLocalTime(user.createdAt, "short")}</p>
			)}

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
			{getCleanSocialLinks(user.socialLinks).length ? (
				<ul className="flex gap-x-4">
					<li className="text-sm text-text-dark">Connect with {cap(user.name || user.username)}</li>
					{getCleanSocialLinks(user.socialLinks).map((item: any, index: number) => (
						<li key={index}>
							<a href={item.url} target="_blank" className="text-black-900">
								<Icon name={item.namespace} className="w-6 h-6 pointer-events-none fill-black-100 text-black-100" />
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
