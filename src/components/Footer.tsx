import { Link } from "react-router-dom";
import { Logo, Twitter, Facebook, Linkedin } from "../assets/icons";
import { useAuthContext } from "../hooks/useAuthContext";

type FooterLink = { to: string; label: string; external?: boolean };

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
	return (
		<div>
			<h3 className="mb-4 text-xs font-medium tracking-widest uppercase text-text-dark">{title}</h3>
			<ul className="flex flex-col gap-y-3">
				{links.map(link => (
					<li key={link.label}>
						{link.external ? (
							<a href={link.to} target="_blank" rel="noopener noreferrer" className="text-sm transition-colors text-text-light hover:text-text-dark">
								{link.label}
							</a>
						) : (
							<Link to={link.to} className="text-sm transition-colors text-text-light hover:text-text-dark">
								{link.label}
							</Link>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}

function Footer() {
	const { state } = useAuthContext();
	const user = state.user;
	const profilePath = user ? `/${user.username || user._id}` : "/";

	const discoverLinks: FooterLink[] = [{ to: "/", label: "Home" }];
	const accountLinks: FooterLink[] = user
		? [
				{ to: profilePath, label: "Profile" },
				{ to: `${profilePath}/about`, label: "About you" },
				{ to: `${profilePath}/settings`, label: "Settings" },
				{ to: "/new-story", label: "Write a story" },
			]
		: [
				{ to: "/login", label: "Sign in" },
				{ to: "/signup", label: "Get started" },
			];

	const resourceLinks: FooterLink[] = [
		{ to: "/stats", label: "Site stats" },
		{ to: "https://eissawebdev.top/hire", label: "Work with us", external: true },
	];

	const socialLinks = [
		{ name: "twitter", href: "https://twitter.com", Icon: Twitter },
		{ name: "facebook", href: "https://facebook.com", Icon: Facebook },
		{ name: "linkedin", href: "https://linkedin.com", Icon: Linkedin },
	];

	return (
		<footer className="px-4 py-12 mt-8 border-t border-border-light bg-white">
			<div className="mx-auto max-w-max">
				<div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
					<div className="sm:col-span-2 lg:col-span-1">
						<Link to="/" className="inline-block mb-5">
							<Logo className="h-5" />
						</Link>
						<p className="max-w-xs mb-6 font-desc text-sm leading-relaxed text-text-light">
							Discover stories, thinking, and expertise from writers on any topic.
						</p>
						{!user && (
							<Link
								to="/signup"
								className="inline-block rounded-[1.25em] px-5 py-2 text-sm font-normal text-white transition-all bg-black-200 hover:bg-black-900"
							>
								Start reading
							</Link>
						)}
					</div>

					<FooterColumn title="Discover" links={discoverLinks} />
					<FooterColumn title="Account" links={accountLinks} />
					<FooterColumn title="Resources" links={resourceLinks} />
				</div>

				<div className="flex flex-col items-start justify-between gap-6 pt-10 mt-10 border-t border-border-light sm:flex-row sm:items-center">
					<ul className="flex gap-x-4">
						{socialLinks.map(({ name, href, Icon }) => (
							<li key={name}>
								<a href={href} target="_blank" rel="noopener noreferrer" aria-label={name} className="transition-opacity opacity-70 hover:opacity-100">
									<Icon className="w-5 h-5 fill-black-100 text-black-100" />
								</a>
							</li>
						))}
					</ul>

					<p className="text-xs text-text-light">
						© {new Date().getFullYear()} Medium. Human stories &amp; ideas.
					</p>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
