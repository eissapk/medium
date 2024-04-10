import { Suspense, useEffect, useState } from "react";
import { cap, cookies, fetchAPI } from "../utils";
import { Await, defer, useLoaderData } from "react-router-dom";
import Spinner from "../components/Spinner";
import { profilePic } from "../assets";
import Modal from "../components/Modal";
import Ad from "../components/Ad";

// todo: add delete account option
function Settings() {
	const { userData } = useLoaderData() as { userData: any };
	const [type, setType] = useState("");
	const [modalTitle, setModalTitle] = useState("");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState<string | null>(null);
	const [bio, setBio] = useState<string | null>(null);
	const [avatar, setAvatar] = useState<string | null>(null);
	const [isModalShown, setIsModalShown] = useState(false);

	useEffect(() => {
		(async () => {
			const email = cookies.get("email"); // set by server
			const id = cookies.get("username") || cookies.get("userId"); // set by server
			if (!email || !id) return location.replace("/");

			const user = await userData;
			setEmail(user.email);
			setUsername(user.username);
			setName(user.name);
			setBio(user.bio);
			setAvatar(user.avatar);
		})();
	}, [userData]);

	const editProfile = (type: string, title: string) => {
		console.log(type);
		setType(type);
		setModalTitle(title);
		setIsModalShown(true);
	};

	const hideModal = (dialog: any) => {
		console.log("hide");
		if (dialog.current) {
			console.log(dialog.current);
			setIsModalShown(false); // todo: handle it with native hide method of dialog
			// dialog.current.hide();
		}
	};

	const submit = (dialog: any) => {
		console.log("submit");

		if (dialog.current) {
			console.log(dialog.current);
			console.log({ name, username, email, password, bio, avatar });
			// todo: fetch endpoint to update some user data
		}
	};

	const modalContent = (type: string) => {
		return (
			<>
				{type == "email" && <input className="w-1/2 px-2 py-1 transition-all border rounded-sm border-border-light" type="email" value={email} onChange={e => setEmail(e.target.value)} />}
				{type == "username" && <input className="w-1/2 px-2 py-1 transition-all border rounded-sm border-border-light" type="text" value={username} onChange={e => setUsername(e.target.value)} />}
				{type == "password" && <input className="w-1/2 px-2 py-1 transition-all border rounded-sm border-border-light" type="text" value={password} onChange={e => setPassword(e.target.value)} />}
				{type == "info" && (
					<>
						<div className="mb-2 ">
							<label className="font-medium inline-block text-sm text-text-light min-w-[7rem]">Photo</label>
							<img className="h-6 rounded-full" src={avatar || profilePic} alt="avatar" />
						</div>
						<div className="mb-2">
							<label className="font-medium inline-block text-sm text-text-light min-w-[7rem]">Name</label>
							<input className="w-1/2 px-2 py-1 transition-all border rounded-sm border-border-light" type="text" value={name || ""} onChange={e => setName(e.target.value)} />
						</div>
						<div className="">
							<label className="font-medium inline-block text-sm text-text-light min-w-[7rem]">Bio</label>
							<input className="w-1/2 px-2 py-1 transition-all border rounded-sm border-border-light" type="text" value={bio || ""} onChange={e => setBio(e.target.value)} />
						</div>
					</>
				)}
			</>
		);
	};

	return (
		<>
			{isModalShown && (
				<Modal title={modalTitle} hideModal={hideModal} submit={submit}>
					{modalContent(type)}
				</Modal>
			)}

			<div className="px-4 py-4 mb-4">
				<div className="mx-auto max-w-max">
					<h1 className="text-[2.6rem] font-medium text-text-dark my-10">Settings</h1>
					<div className="grid grid-cols-1 py-5 mt-5 gap-y-10 gap-x-20 md:grid-cols-[2fr_1fr]">
						<div className="grid gap-10">
							<div className="flex flex-col gap-y-5">
								<Suspense fallback={<Spinner isLine={true} />}>
									<Await resolve={userData}>
										{json => (
											<>
												<div>
													<button type="button" className="flex justify-between w-full py-2" onClick={() => editProfile("email", "Email address")}>
														<span className="text-sm text-text-dark">Email address</span>
														<span className="text-sm text-text-light">{json.email}</span>
													</button>
												</div>
												<div>
													<button type="button" className="flex justify-between w-full py-2" onClick={() => editProfile("password", "Password")}>
														<span className="text-sm text-text-dark">Password</span>
														<span className="text-sm text-text-light">*******</span>
													</button>
												</div>
												<div>
													<button type="button" className="flex justify-between w-full py-2" onClick={() => editProfile("username", "Username and subdomain")}>
														<span className="text-sm text-text-dark">Username and subdomain</span>
														<span className="text-sm text-text-light">{json.username}</span>
													</button>
												</div>
												<div>
													<button type="button" className="flex justify-between w-full py-2" onClick={() => editProfile("info", "Profile information")}>
														<span className="flex flex-col gap-y-2 text-start">
															<span className="text-sm text-text-dark">Profile information</span>
															<span className="text-xs text-text-light">Edit your photo, name, bio, etc.</span>
														</span>
														<span className="flex items-center gap-x-3">
															<span className="text-sm text-text-light">{cap(json.name || json.username)}</span>
															<img className="h-6 rounded-full" src={json.avatar || profilePic} alt="avatar" />
														</span>
													</button>
												</div>
											</>
										)}
									</Await>
								</Suspense>
							</div>
						</div>
						<div className="pt-10 border-t border-border-light md:pt-0 md:px-10 md:border-t-0 md:border-s">
							<Ad>
								<h2 className="text-3xl font-bold text-center text-black-100">Imagine your ad here.</h2>
							</Ad>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Settings;

const loadUser = async (id: string) => {
	const response = await fetchAPI("/api/user/" + id, { headers: { "Content-Type": "application/json" } });
	const json = await response.json();

	if (json.error) {
		const error: any = new Error(json.message);
		error.code = response.status;
		throw error;
	}
	console.log("loadUser:", json);
	return json.data;
};

export const loader = async ({ params }: any) => {
	const { userId } = params;
	return defer({ userData: loadUser(userId) });
};
