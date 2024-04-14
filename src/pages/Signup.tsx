import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import cx from "classnames";
import { useSignup } from "../hooks/useSignup";
import { Form, Formik } from "formik";
import Input from "../components/Input";
import { signupSchema } from "../schema";
import { fetchAPI } from "../utils";

const inputStyle = "px-1 mx-4 transition-all border rounded border-border-light";
const labelStyle = "font-medium inline-block text-sm text-text-light min-w-[7rem]";
const submitBtnStyle = "px-6 py-2 mx-auto block text-sm text-green transition-all rounded-full opacity-80 hover:opacity-100 border-green border font-medium";
const initialValues = { username: "", email: "", password: "", confirmPassword: "" };

function Signup() {
	const navigate = useNavigate();
	const { signup, error, isLoading } = useSignup();
	const { state } = useAuthContext();
	const [t, setT] = useState<null | ReturnType<typeof setTimeout>>(null);
	const [userIsTaken, setUserIsTaken] = useState(false);

	const errorElement = (text: string | boolean, className = "") => (
		<div className={`p-2.5 bg-red-light border border-border-light rounded my-4 text-center text-sm text-text-light ${className}`}>{text}</div>
	);

	useEffect(() => {
		if (state.user) navigate("/");
	}, [state.user, navigate]);

	async function submitHandler(values: any, actions: any) {
		console.log({ values, actions });
		if (values.password !== values.confirmPassword) return;
		await signup(values.email, values.username, values.password);
		// actions.resetForm();
	}

	const usernameChecker = async (text: string) => {
		// console.log("debounce", text);
		const response = await fetchAPI("/api/user/username/" + text, { headers: { "Content-Type": "application/json" } });
		const json = await response.json();
		if (json.success) {
			if (json?.data?.taken) setUserIsTaken(true);
			else setUserIsTaken(false);
		}
	};

	const debounceHandler = (text: string) => {
		if (text?.trim() === "") return;
		text = text.trim();
		if (t) clearTimeout(t);
		setT(setTimeout(() => usernameChecker(text), 200));
	};

	return (
		<main className="flex justify-center">
			<div>
				<h1 className="mt-5 mb-10 text-3xl text-center font-title text-black-200">Join Medium.</h1>

				<Formik initialValues={initialValues} validationSchema={signupSchema} onSubmit={submitHandler}>
					{props => (
						<Form>
							<div className="mb-2">
								<Input className={inputStyle} autoFocus={true} labelStyle={labelStyle} label="Your Email" name="email" type="email" placeholder="domain@example.com" />
							</div>
							<div className="mb-2">
								<Input debounce={debounceHandler} className={inputStyle} labelStyle={labelStyle} label="Username" name="username" type="text" placeholder="creative_man" />
								{userIsTaken && <p className="text-start text-xs my-2 text-red">Username is already taken</p>}
							</div>
							<div className="mb-2">
								<Input className={inputStyle} labelStyle={labelStyle} label="Your Password" name="password" type="password" />
							</div>
							<div className="mb-4">
								<Input className={inputStyle} labelStyle={labelStyle} label="Confirm Password" name="confirmPassword" type="password" />
							</div>
							<button className={cx(submitBtnStyle, { "opacity-50": props.isSubmitting || isLoading })} disabled={props.isSubmitting || isLoading} type="submit">
								Sign up
							</button>
						</Form>
					)}
				</Formik>

				{error && errorElement(error)}

				<p className="text-center text-text-light">
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
