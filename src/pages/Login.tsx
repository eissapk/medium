import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import cx from "classnames";
import { useAuthContext } from "../hooks/useAuthContext";
import { Form, Formik } from "formik";
import Input from "../components/Input";
import { loginSchema } from "../schema";
import { Loader } from "../assets/icons";

const labelStyle = "font-medium inline-block text-sm text-text-light min-w-[7rem]";
const submitBtnStyle = "flex items-center gap-x-2 px-6 py-2 mx-auto block text-sm text-green transition-all rounded-full border-green border font-medium";
const initialValues = { email: "", password: "" };

function Login() {
	const navigate = useNavigate();
	const { state } = useAuthContext();
	const { login, error, isLoading } = useLogin();

	useEffect(() => {
		if (state.user) navigate("/");
	}, [state.user, navigate]);
	async function handleSubmit(values: any) {
		// console.log({ values, actions });
		await login(values.email, values.password);
	}
	const errorElement = (text: string | boolean, className = "") => (
		<div className={`p-2.5 bg-red-light border border-border-light rounded my-4 text-center text-sm text-text-light ${className}`}>{text}</div>
	);
	return (
		<main className="flex justify-center max-w-96 mx-auto">
			<div>
				<h1 className="mt-5 mb-10 text-3xl text-center font-title text-black-200">Welcome back.</h1>

				<Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={handleSubmit}>
					{props => (
						<Form>
							<div className="mb-2">
								<Input autoFocus={true} labelStyle={labelStyle} label="Your Email" name="email" type="email" placeholder="domain@example.com" />
							</div>
							<div className="mb-2">
								<Input labelStyle={labelStyle} label="Your Password" name="password" type="password" />
							</div>
							<button className={cx(submitBtnStyle, { "opacity-30": isLoading, "opacity-80 hover:opacity-100": !isLoading })} disabled={isLoading || props.isSubmitting} type="submit">
								<span>Sign in</span>
								{isLoading && <Loader className="inline w-3 h-3 text-green" />}
							</button>
						</Form>
					)}
				</Formik>

				{error && errorElement(error)}

				<p className="mt-4 text-center text-text-light">
					<span className="me-2">No account?</span>
					<Link to="/signup" className="font-medium text-green">
						Create one
					</Link>
				</p>
			</div>
		</main>
	);
}

export default Login;
