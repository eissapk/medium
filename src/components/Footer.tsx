function Footer() {
	return (
		<footer className="flex justify-center pt-4 mt-4 border-t border-border-light">
			<ul className="flex justify-center gap-x-5 text-text">
				<li>
					<a href="/about" className="text-sm text-text-light">
						About
					</a>
				</li>
				<li>
					<a href="/sitemap" className="text-sm text-text-light">
						Sitemap
					</a>
				</li>
			</ul>
		</footer>
	);
}

export default Footer;
