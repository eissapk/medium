import { Suspense, useEffect, useRef, useState } from "react";
import { cookies, fetchAPI } from "../utils";
import { Outlet, defer, Await, useLoaderData } from "react-router-dom";
import { profilePic } from "../assets";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import Ad from "../components/Ad";
import SettingsModalContent from "../components/SettingsModalContent";

// todo: add delete account option
function SettingsLayout() {
	const { userData } = useLoaderData() as { userData: any };

	// props for Modal
	const [type, setType] = useState("");
	const [modalTitle, setModalTitle] = useState("");
	const [modalErrorMessage, setModalErrorMessage] = useState(null);
	const [modalSuccessMessage, setModalSuccessMessage] = useState(null);

	// initial user data
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [avatar, setAvatar] = useState<string | null>("");
	const [name, setName] = useState<string | null>("");
	const [title, setTitle] = useState<string | null>("");
	const [bio, setBio] = useState<string | null>("");
	const [socialLinks, setSocialLinks] = useState<any[]>([]);

	const dialogRef = useRef(null);
	const avatarRef = useRef(null);

	const [avatarFileObj, setAvatarFileObj] = useState(null);

	useEffect(() => {
		// if (state.user) console.log(state.user);
		(async () => {
			const email = cookies.get("email"); // set by server
			const id = cookies.get("username") || cookies.get("userId"); // set by server
			if (!email || !id) return location.replace("/");

			const user = await userData;
			setEmail(user.email);
			setUsername(user.username);
			// info section
			setAvatar(user.avatar || "");
			setName(user.name || "");
			setTitle(user.title || "");
			setBio(user.bio || "");
			setSocialLinks(
				user.socialLinks.length
					? user.socialLinks
					: [
							{ url: "", namespace: "twitter" },
							{ url: "", namespace: "linkedin" },
							{ url: "", namespace: "facebook" },
					  ]
			);
		})();
	}, [userData]);

	const editProfile = (type: string, title: string) => {
		if (!dialogRef.current) return;

		setAvatarFileObj(null); // clear memory
		setType(type);
		setModalTitle(title);

		// @ts-expect-error -- handle it later
		dialogRef.current.showModal();

		setTimeout(() => {
			// @ts-expect-error -- handle it later
			if (avatarRef?.current) avatarRef.current.src = avatar || profilePic;

			// auto focus the first input
			// @ts-expect-error -- handle it later
			const inputs = dialogRef.current.querySelectorAll("input");
			if (!inputs.length) return;
			if (type == "info") return inputs[1].focus();
			inputs[0].focus();
		}, 0);
	};

	return (
		<>
			<Modal errorMessage={modalErrorMessage} successMessage={modalSuccessMessage} title={modalTitle} ref={dialogRef}>
				<SettingsModalContent
					setModalErrorMessage={setModalErrorMessage}
					setModalSuccessMessage={setModalSuccessMessage}
					type={type}
					email={email}
					username={username}
					avatar={avatar}
					name={name}
					title={title}
					bio={bio}
					socialLinks={socialLinks}
					avatarFileObj={avatarFileObj}
					setAvatarFileObj={setAvatarFileObj}
					ref={avatarRef}
					dialogRef={dialogRef}
				/>
			</Modal>

			<div className="px-4 py-4 mb-4">
				<div className="mx-auto max-w-max">
					<h1 className="text-[2.6rem] font-medium text-text-dark my-10">Settings</h1>
					<div className="grid grid-cols-1 py-5 mt-5 gap-y-10 gap-x-20 md:grid-cols-[2fr_1fr]">
						<div className="grid gap-10">
							<div className="flex flex-col gap-y-5">
								<Suspense fallback={<Spinner isLine={true} />}>
									<Await resolve={userData}>{user => <Outlet context={{ user, editProfile }} />}</Await>
								</Suspense>
							</div>
						</div>
						<div className="pt-10 border-t border-border-light md:pt-0 md:px-10 md:border-t-0 md:border-s">
							<Ad></Ad>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default SettingsLayout;

const loadUser = async (id: string) => {
	const response = await fetchAPI("/api/user/" + id, { headers: { "Content-Type": "application/json" } });
	const json = await response.json();

	if (json.error) {
		const error: any = new Error(json.message);
		error.code = response.status;
		throw error;
	}
	// console.log("loadUser:", json);
	return json.data;
};

export const loader = async ({ params }: any) => {
	const { userId } = params;
	return defer({ userData: loadUser(userId) });
};
