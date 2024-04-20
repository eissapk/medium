import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import cx from "classnames";
import { useSignup } from "../hooks/useSignup";
import { Form, Formik } from "formik";
import Input from "../components/Input";
import { signupSchema } from "../schema";
import { checkUsername } from "../utils";
import { useMutation } from "@tanstack/react-query";
import { Tick, Warn, Loader } from "../assets/icons";

const labelStyle = "font-medium inline-block text-sm text-text-light min-w-[7rem]";
const submitBtnStyle = "flex items-center gap-x-2 px-6 py-2 mx-auto block text-sm mt-4 text-green transition-all rounded-full border-green border font-medium";
const initialValues = { username: "", email: "", password: "", confirmPassword: "" };

// todo: add email provider like sendgrid to check if email is real and for sending confirmation emails
function Signup() {
	const navigate = useNavigate();
	const { signup, error, isLoading } = useSignup();
	const { state } = useAuthContext();
	const [t, setT] = useState<null | ReturnType<typeof setTimeout>>(null);
	const [isTyping, setIsTyping] = useState(false);

	const { mutate, isPending: checkPending, data: checkData } = useMutation({ mutationFn: checkUsername });

	const errorElement = (text: string | boolean, className = "") => (
		<div className={`p-2.5 bg-red-light border border-border-light rounded mt-4 text-center text-sm text-text-light ${className}`} dangerouslySetInnerHTML={{ __html: text }}></div>
	);

	useEffect(() => {
		if (state.user) navigate("/");
	}, [state.user, navigate]);

	async function submitHandler(values: any) {
		// console.log({ values, actions });
		if (values.password !== values.confirmPassword) return;
		await signup(values.email, values.username, values.password);
	}

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

	return (
		<main className="flex justify-center max-w-96 mx-auto">
			<div>
				<h1 className="mt-5 mb-10 text-3xl text-center font-title text-black-200">Join Medium.</h1>

				<Formik initialValues={initialValues} validationSchema={signupSchema} onSubmit={submitHandler}>
					{props => (
						<Form>
							<div className="mb-2">
								<Input className="ms-2" autoFocus={true} labelStyle={labelStyle} label="Your Email" name="email" type="email" placeholder="domain@example.com" />
							</div>
							<div className="mb-2">
								<Input className="ms-2" onChangeHook={debounceHandler} labelStyle={labelStyle} label="Username" name="username" type="text" placeholder="creative_man" />
								{usernameValidityLinter(props)}
							</div>
							<div className="mb-2">
								<Input className="ms-2" labelStyle={labelStyle} label="Your Password" name="password" type="password" />
							</div>
							<div className="mb-4">
								<Input className="ms-2" labelStyle={labelStyle} label="Confirm Password" name="confirmPassword" type="password" />
							</div>
							<button className={cx(submitBtnStyle, { "opacity-30": isLoading, "opacity-80 hover:opacity-100": !isLoading })} disabled={isLoading} type="submit">
								<span>Sign up</span>
								{isLoading && <Loader className="inline w-3 h-3 text-green" />}
							</button>
						</Form>
					)}
				</Formik>

				{error && errorElement(error)}

				<p className="text-center text-text-light mt-4">
					<span className="me-2">Already have an account?</span>
					<Link to="/login" className="font-medium text-green">
						Sign in
					</Link>
				</p>
			</div>
		</main>
	);
}

export default Signup;
