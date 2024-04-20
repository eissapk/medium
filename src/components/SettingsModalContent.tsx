import { useState, forwardRef } from "react";
import { fetchAPI, checkUsername, cap } from "../utils";
import { profilePic } from "../assets";
import { Form, Formik } from "formik";
import { settingsEmailSchema, settingsUsernameSchema, settingsPasswordSchema, settingsInfoSchema } from "../schema";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import { useAuthContext } from "../hooks/useAuthContext";
import { LOGIN } from "../utils/types";
import { Tick, Warn } from "../assets/icons";
import { useMutation } from "@tanstack/react-query";
import cx from "classnames";

type Props = {
	type: string;
	email: string;
	username: string;
	name: string | null;
	bio: string | null;
	title: string | null;
	avatar: string | null;
	setModalErrorMessage: any;
	setModalSuccessMessage: any;
	dialogRef: any;
	avatarFileObj: null | File;
	setAvatarFileObj: any;
	socialLinks: any[];
};

const SettingsModalContent = forwardRef(function (
	{ type, socialLinks, email, username, name, bio, title, avatar, avatarFileObj, setAvatarFileObj, dialogRef, setModalErrorMessage, setModalSuccessMessage }: Props,
	ref: any
) {
	const { state, dispatch } = useAuthContext();
	const { mutate, isPending: checkPending, data: checkData } = useMutation({ mutationFn: checkUsername });
	const [t, setT] = useState<null | ReturnType<typeof setTimeout>>(null);
	const [isTyping, setIsTyping] = useState(false);

	const [avatarErrorMessage, setAvatarErrorMessage] = useState("");
	const [isAvatarError, setIsAvatarError] = useState(false);

	const debounceHandler = (e: any) => {
		let text = e.target.value;
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

	const updateHandler = async (route: string, values: any, actions: any) => {
		// reset
		setAvatarErrorMessage("");
		setIsAvatarError(false);
		const timeout = 1000; // time out is a must as we need to show the message to user before the modal closes

		type INFO = {
			name: null | string;
			title: null | string;
			bio: null | string;
			avatar: null | File;
			socialLinks: string[];
		};
		// @ts-expect-error -- handle it later
		const infoObj: INFO = { name: "", title: "", bio: "", socialLinks: [] }; // avatar must not exist here as we don't want to wipe it out in db (in other words, don't bind avatar prop in this object)
		const formData = new FormData();
		if (route == "info") {
			if (values.name) infoObj.name = values.name;
			if (values.title) infoObj.title = values.title;
			if (values.bio) infoObj.bio = values.bio;
			if (avatarFileObj) infoObj.avatar = avatarFileObj;
			if (values.socialLinks) infoObj.socialLinks = values.socialLinks;

			// todo add validation to check if old value = new value then return message "No changes detected"
			if (!Object.keys(infoObj).length) {
				setModalErrorMessage("No changes detected");
				setTimeout(() => setModalErrorMessage(null), timeout - 100);
				return;
			}

			Object.keys(infoObj).forEach(key => {
				if (key == "socialLinks") {
					infoObj[key].forEach((link: any, index: number) => formData.append("socialLinks[" + index + "]", JSON.stringify(link)));
				} else {
					// @ts-expect-error -- handle it later
					formData.append(key, infoObj[key]);
				}
			});

			// return console.log("info:", infoObj);
		}

		const responseConfig = {
			method: "PUT",
			body: route === "info" ? formData : JSON.stringify(values),
			credentials: "include",
		};
		// @ts-expect-error -- handle it later
		if (route !== "info") responseConfig.headers = { "Content-Type": "application/json" };

		const response = await fetchAPI("/api/user/" + route, responseConfig);
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
			actions.resetForm();
			hideModal();
			if (route == "password") return;

			dispatch({ type: LOGIN, payload: { ...state.user, ...json.data } });
			const username = route === "username" ? json.data.username : state.user.username;

			location.replace("/" + username + "/settings");
		}, timeout);
	};

	const avatarHandler = (e: any) => {
		setAvatarFileObj(null);
		const file = e.target.files[0];
		// console.log(file.size, file.type);
		if (file.size > 1024 * 1024 * 1) {
			setAvatarErrorMessage("Avatar must be less than 1MB");
			setIsAvatarError(true);
			return;
		}
		if (!["image/jpeg", "image/png", "image/gif", "image/jpg"].includes(file.type)) {
			setAvatarErrorMessage("Avatar must be an image file (JPG, PNG, or GIF)");
			setIsAvatarError(true);
			return;
		}
		setAvatarErrorMessage("");
		setIsAvatarError(false);
		setAvatarFileObj(file);

		if (!ref?.current) return;
		const fr = new FileReader();
		fr.onload = () => (ref.current.src = fr.result); // base64 string
		fr.readAsDataURL(file);
	};

	const hideModal = () => dialogRef.current && dialogRef.current.close();

	return (
		<>
			{type == "email" && (
				<Formik initialValues={{ email }} validationSchema={settingsEmailSchema} onSubmit={(values: any, actions: any) => updateHandler("email", values, actions)}>
					<Form id="modalForm">
						<Input name="email" type="email" autoComplete="off" />
					</Form>
				</Formik>
			)}

			{type == "password" && (
				<Formik initialValues={{ password: "" }} validationSchema={settingsPasswordSchema} onSubmit={(values: any, actions: any) => updateHandler("password", values, actions)}>
					<Form id="modalForm">
						<Input name="password" type="text" autoComplete="off" />
						{/* todo: add show password button (eye icon) */}
						{/* todo: add confirm password and old password -- for avoiding accidental password changes by others */}
					</Form>
				</Formik>
			)}

			{type == "username" && (
				<Formik initialValues={{ username }} validationSchema={settingsUsernameSchema} onSubmit={(values: any, actions: any) => updateHandler("username", values, actions)}>
					{props => (
						<Form id="modalForm">
							<Input onChangeHook={debounceHandler} name="username" type="text" autoComplete="off" />
							{usernameValidityLinter(props)}
						</Form>
					)}
				</Formik>
			)}

			{type == "info" && (
				<Formik
					initialValues={{
						name,
						title,
						bio,
						socialLinks,
					}}
					validationSchema={settingsInfoSchema}
					onSubmit={(values: any, actions: any) => updateHandler("info", values, actions)}>
					{props => (
						<Form id="modalForm">
							{/* img */}
							<div className="mb-4">
								<p className="text-text-light">Photo</p>
								<div className="flex mt-2 gap-x-4">
									<img ref={ref} className="h-16 rounded-full" src={avatar || profilePic} alt="avatar" />
									<div className="flex flex-col items-start gap-y-4">
										<button type="button" className="relative text-green">
											<span>Update</span>
											<input type="file" onChange={avatarHandler} className="absolute top-0 left-0 w-full h-full opacity-0" />
										</button>
										<p className="text-sm text-text-light">Recommended: Square JPG, PNG, or GIF, max size 1MB</p>
										{isAvatarError && <p className="my-2 text-xs text-start text-red">{avatarErrorMessage}</p>}
									</div>
								</div>
							</div>

							{/* name */}
							<div className="flex flex-col mb-4">
								<Input wrapperClassName="flex flex-col" name="name" type="text" label="Name" labelStyle="text-text-light" autoComplete="off" />
								<p className="mt-2 text-xs text-text-light">Appears on your Profile page</p>
							</div>
							{/* title */}
							<div className="flex flex-col mb-4">
								<Input wrapperClassName="flex flex-col" name="title" type="text" label="Title" labelStyle="text-text-light" autoComplete="off" />
								<p className="mt-2 text-xs text-text-light">Appears on your Profile page - supports markdown</p>
							</div>
							{/* bio */}
							<div className="flex flex-col mb-4">
								<TextArea name="bio" label="Bio" rows={5} labelStyle="text-text-light" />
								<p className="mt-2 text-xs text-text-light">Appears on your About page - supports markdown</p>
							</div>
							{/* social links */}
							{props.values.socialLinks.map((item, index) => (
								<div className="flex flex-col mb-4" key={index}>
									<Input
										wrapperClassName="flex flex-col"
										name={`socialLinks[${index}].url`}
										type="url"
										label={cap(item.namespace)}
										placeholder={`https://${item.namespace}.com/username`}
										labelStyle="text-text-light"
										autoComplete="off"
									/>
								</div>
							))}
						</Form>
					)}
				</Formik>
			)}
		</>
	);
});

export default SettingsModalContent;
