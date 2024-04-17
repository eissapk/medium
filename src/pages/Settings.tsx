import { Suspense, useEffect, useRef, useState } from "react";
import { cap, cookies, fetchAPI, checkUsername } from "../utils";
import { Await, defer, useLoaderData, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { profilePic } from "../assets";
import Modal from "../components/Modal";
import Ad from "../components/Ad";
import { Form, Formik } from "formik";
import { settingsEmailSchema, settingsUsernameSchema, settingsPasswordSchema, settingsInfoSchema } from "../schema";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import { useAuthContext } from "../hooks/useAuthContext";
import { LOGIN } from "../utils/types";
import { Tick, Warn } from "../assets/icons";
import { useMutation } from "@tanstack/react-query";
import cx from "classnames";

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
	const [title, setTitle] = useState<string | null>(null);
	const [avatar, setAvatar] = useState<string | null>(null);
	const dialogRef = useRef(null);
	const { state, dispatch } = useAuthContext();
	const navigate = useNavigate();
	const { mutate, isPending: checkPending, data: checkData } = useMutation({ mutationFn: checkUsername });
	const [t, setT] = useState<null | ReturnType<typeof setTimeout>>(null);
	const [isTyping, setIsTyping] = useState(false);

	useEffect(() => {
		// if (state.user) console.log(state.user);
		(async () => {
			const email = cookies.get("email"); // set by server
			const id = cookies.get("username") || cookies.get("userId"); // set by server
			if (!email || !id) return location.replace("/");

			const user = await userData;
			setEmail(user.email);
			setUsername(user.username);
			setName(user.name);
			setTitle(user.title);
			setBio(user.bio);
			setAvatar(user.avatar);
		})();
	}, [userData, state.user]);

	const editProfile = (type: string, title: string) => {
		// console.log(type);
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
	const debounceHandler = (text: string) => {
		setIsTyping(true);
		if (text?.trim() === "") return;
		text = text.trim();
		if (t) clearTimeout(t);
		setT(
			setTimeout(() => {
				setIsTyping(false);
				// console.log("debounce", text);
				mutate(text);
			}, 200)
		);
	};
	const usernameValidityLinter = (props: any) => {
		const fixedClasses = "text-start text-xs my-2";
		if (checkPending) return <p className={cx(fixedClasses, "text-text-light")}>Checking availability...</p>;
		if (checkData?.taken)
			return (
				<p className={cx(fixedClasses, "text-start text-xs my-2 text-red flex items-center")}>
					<Warn className="inline w-3 h-3 me-1" />
					<span>{props.values.username} already taken</span>
				</p>
			);
		if (!props.errors.username && checkData && checkData?.hasOwnProperty("taken") && !checkData?.taken && !isTyping) {
			return (
				<p className={cx(fixedClasses, "text-green flex items-center")}>
					<Tick className="inline w-3 h-3 me-1" />
					<span>{props.values.username} is available</span>
				</p>
			);
		}
	};
	const updateHandler = async (route: string, values: any) => {
		if (route == "info") return console.log("info:", values);

		const timeout = 1000; // time out is a must as we need to show the message to user before the modal closes
		const response = await fetchAPI("/api/user/" + route, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values), credentials: "include" });
		const json = await response.json();
		if (json.error) {
			setModalErrorMessage(json.message);
			setTimeout(() => setModalErrorMessage(null), timeout - 100);
			const error: any = new Error(json.message);
			error.code = response.status;
			throw error;
		}
		setModalSuccessMessage(json.message);
		setTimeout(() => setModalSuccessMessage(null), timeout - 100);
		setTimeout(() => {
			hideModal(dialogRef);
			if (route == "password") return;

			dispatch({ type: LOGIN, payload: { ...state.user, [route]: json.data[route] } });
			const username = route === "username" ? json.data.username : state.user.username;

			// console.log("navigate to /" + username + "/settings");

			navigate("/" + username + "/settings");
			setTimeout(() => location.reload(), 200); // time out is a must -- bugfix
		}, timeout);
	};

	// handle avatar validation
	const info = (props: any) => {
		return (
			<>
				{/* img */}
				<div className="mb-4">
					<p className="text-text-light">Photo</p>
					<div className="flex gap-x-4 mt-2">
						<img className="h-16 rounded-full" src={avatar || profilePic} alt="avatar" />
						<div className="flex flex-col gap-y-4 items-start">
							<button type="button" className="text-green">
								Update
								{/* <Input name="avatar" type="file" /> */}
							</button>
							<p className="text-text-light text-sm">Recommended: Square JPG, PNG, or GIF, max size 1MB</p>
						</div>
					</div>
				</div>

				{/* name */}
				<div className="mb-4 flex flex-col">
					<Input name="name" type="text" label="Name" labelStyle="text-text-light" />
					<p className="text-text-light text-xs mt-2">Appears on your Profile page</p>
				</div>
				{/* title */}
				<div className="mb-4 flex flex-col">
					<Input name="title" type="text" label="Title" labelStyle="text-text-light" />
					<p className="text-text-light text-xs mt-2">Appears on your Profile page - supports markdown</p>
				</div>
				{/* bio */}
				<div className="mb-4 flex flex-col">
					<TextArea name="bio" label="Bio" rows={1} labelStyle="text-text-light" />
					<p className="text-text-light text-xs mt-2">Appears on your Profile page - supports markdown</p>
				</div>
			</>
		);
	};

	return (
		<>
			<Modal errorMessage={modalErrorMessage} successMessage={modalSuccessMessage} title={modalTitle} hideModal={hideModal} ref={dialogRef}>
				{type == "email" && (
					<Formik initialValues={{ email }} validationSchema={settingsEmailSchema} onSubmit={values => updateHandler("email", values)}>
						<Form id="modalForm">
							<Input name="email" type="email" />
						</Form>
					</Formik>
				)}
				{type == "password" && (
					<Formik initialValues={{ password: "" }} validationSchema={settingsPasswordSchema} onSubmit={values => updateHandler("password", values)}>
						<Form id="modalForm">
							<Input name="password" type="text" />
							{/* todo: add show password button (eye icon) */}
						</Form>
					</Formik>
				)}
				{type == "username" && (
					<Formik initialValues={{ username }} validationSchema={settingsUsernameSchema} onSubmit={(values: any) => updateHandler("username", values)}>
						{props => (
							<Form id="modalForm">
								<Input onChangeHook={debounceHandler} name="username" type="text" />
								{usernameValidityLinter(props)}
							</Form>
						)}
					</Formik>
				)}
				{type == "info" && (
					<Formik initialValues={{ avatar, name, title, bio }} validationSchema={settingsInfoSchema} onSubmit={(values: any) => updateHandler("info", values)}>
						{props => <Form id="modalForm">{info(props)}</Form>}
					</Formik>
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
							<Ad></Ad>
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
