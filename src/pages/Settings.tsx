import { Suspense, useEffect, useRef, useState } from "react";
import { cap, cookies, fetchAPI } from "../utils";
import { Await, defer, useLoaderData, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { profilePic } from "../assets";
import Modal from "../components/Modal";
import Ad from "../components/Ad";
import { Form, Formik } from "formik";
import { settingsEmailSchema, settingsUsernameSchema, settingsPasswordSchema } from "../schema";
import Input from "../components/Input";
import { useLogout } from "../hooks/useLogout";

const inputStyle = "px-1 transition-all border rounded border-border-light";
// todo: add delete account option
function Settings() {
	const { userData } = useLoaderData() as { userData: any };
	const [type, setType] = useState("");
	const [modalTitle, setModalTitle] = useState("");
	const [modalErrorMessage, setModalErrorMessage] = useState(null);
	const [modalSuccessMessage, setModalSuccessMessage] = useState(null);
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [name, setName] = useState<string | null>(null);
	const [bio, setBio] = useState<string | null>(null);
	const [avatar, setAvatar] = useState<string | null>(null);
	const dialogRef = useRef(null);
	const { logout } = useLogout();
	const navigate = useNavigate();

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
		if (dialogRef.current) {
			// @ts-expect-error -- handle it later
			dialogRef.current.showModal();

			// auto focus 1st input
			setTimeout(() => {
				// @ts-expect-error -- handle it later
				const input = dialogRef.current.querySelector("input");
				if (input) input.focus();
			}, 0);
		}
	};

	const hideModal = (dialog: any) => {
		if (dialog.current) dialog.current.close();
	};

	const updateHandler = async (route: string, values: any) => {
		const response = await fetchAPI("/api/user/" + route, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values), credentials: "include" });
		const json = await response.json();
		if (json.error) {
			setModalErrorMessage(json.message);
			setTimeout(() => setModalErrorMessage(null), 1000);
			const error: any = new Error(json.message);
			error.code = response.status;
			throw error;
		}
		setModalSuccessMessage(json.message);
		setTimeout(() => {
			hideModal(dialogRef);
			logout(() => {
				setTimeout(() => navigate("/"), 200);
			});
		}, 1000);
	};

	// todo: check how to handle submit button for formik without losing the layout of modal
	return (
		<>
			<Modal errorMessage={modalErrorMessage} successMessage={modalSuccessMessage} title={modalTitle} hideModal={hideModal} ref={dialogRef}>
				{type == "email" && (
					<Formik initialValues={{ email }} validationSchema={settingsEmailSchema} onSubmit={values => updateHandler("email", values)}>
						<Form id="modalForm">
							<Input className={inputStyle} name="email" type="email" />
						</Form>
					</Formik>
				)}
				{type == "password" && (
					<Formik initialValues={{ password: "" }} validationSchema={settingsPasswordSchema} onSubmit={values => updateHandler("password", values)}>
						<Form id="modalForm">
							<Input className={inputStyle} name="password" type="text" />
						</Form>
					</Formik>
				)}
				{type == "username" && (
					<Formik initialValues={{ username }} validationSchema={settingsUsernameSchema} onSubmit={(values: any) => updateHandler("username", values)}>
						<Form id="modalForm">
							<Input className={inputStyle} name="username" type="text" />
						</Form>
					</Formik>
				)}
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
			</Modal>

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
	// console.log("loadUser:", json);
	return json.data;
};

export const loader = async ({ params }: any) => {
	const { userId } = params;
	return defer({ userData: loadUser(userId) });
};
