function Profile() {
	return (
		<div className="mt-10">
			<ul>
				<li>
					<a href="/link-to-user-profile" className="flex gap-x-2 bg-slate-500">
						<span>Feb 27,2024</span>
					</a>

					<a href="/link-to-article" className=" bg-slate-400">
						<div className="inline-block">
							<h1>article title</h1>
							<p>article description...</p>
						</div>
						<div className="inline-block bg-main">
							<img src="" alt="article thumbnail" />
						</div>
					</a>

					<div className=" bg-slate-300 flex gap-x-2">
						<span className="category bg-slate-950 text-white p-1 rounded text-sm">Javascript</span>
						<span>6 min read</span>
						<span>. </span>
						<span>bookmark</span>
					</div>
				</li>
			</ul>
		</div>
	);
}

export default Profile;
