// handle this and it's endpoints -- vip to add profile picture
function Settings() {
	function showModal() {
		console.log("showModal form");
	}

	return (
		<div>
			<h1 className=" text-lg">Settings</h1>

			<div className="">
				<button type="button" onClick={showModal} className="block">
					<span>Email address</span>
					<span>essas@example.com</span>
				</button>
				<button type="button" onClick={showModal} className="block">
					<span>Username and subdomain</span>
					<span>@eissam</span>
				</button>
				<button type="button" onClick={showModal} className="block">
					<div>
						<span>Profile information</span>
						<p> Edit your photo, name, bio, etc.</p>
					</div>
					<div>
						<span>Eissapk</span>
						<img src="" alt="avatar" />
					</div>
				</button>
				<button type="button" onClick={showModal} className="block">
					<p>Delete account</p>
					<p>permanently delete your account and all your content</p>
				</button>
			</div>
		</div>
	);
}

export default Settings;
