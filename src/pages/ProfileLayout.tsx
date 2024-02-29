import { Outlet, Link } from "react-router-dom";

function ProfileLayout() {
	return (
		<>
			<div className="left float-start">
				<h1 className="text-lg mt-3 mb-10">
					Eissapk
					<button type="button" className="bg-main ml-2">
						copy profile link icon
					</button>
				</h1>
				<ul className="inline-flex bg-yellow gap-2 px-10">
					<li>
						<Link to="/me">Home</Link>
					</li>
					<li>
						<Link to="/me/about">About</Link>
					</li>
					<li>
						<Link to="/me/followers">Followers</Link>
					</li>
					<li>
						<Link to="/me/following">Following</Link>
					</li>
				</ul>
				<Outlet />
			</div>

			<div className="right float-end">
				<Link to={"/me"}>
					<img src="" alt="avatar" />
					<h2>Name</h2>
				</Link>
				<Link to={"/me/followers"}>
					<p>27K Followers</p>
				</Link>
				<p>Editor of INSURGE intelligence and Return of the Reich</p>
				<button className="bg-main">Follow</button>
			</div>
		</>
	);
}

export default ProfileLayout;
