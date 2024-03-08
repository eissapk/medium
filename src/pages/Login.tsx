import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import cx from "classnames";
import { useAuthContext } from "../hooks/useAuthContext";
function Login() {
	const navigate = useNavigate();
	const { state } = useAuthContext();
	const { login, error, isLoading } = useLogin();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	useEffect(() => {
		if (state.user) navigate("/");
	}, [state.user, navigate]);
	async function handleSubmit(e) {
		e.preventDefault();
		await login(email, password);
	}
	const errorElement = (text, className = "") => <div className={`p-2.5 bg-red border border-border-light rounded my-4 text-center text-sm text-text-light ${className}`}>{text}</div>;
	return (
		<main className="flex justify-center">
			<div>
				<h1 className="mt-5 mb-10 text-3xl text-center font-title text-black-200">Welcome back.</h1>

				<form onSubmit={handleSubmit}>
					<div className="mb-2">
						<label className="font-medium inline-block text-sm text-text-light min-w-[7rem]">Your email</label>
						<input className="px-1 mx-4 transition-all border rounded-sm border-border-light" autoFocus type="email" value={email} onChange={e => setEmail(e.target.value)} />
					</div>
					<div className="mb-4">
						<label className="font-medium inline-block text-sm text-text-light min-w-[7rem]">Your password</label>
						<input className="px-1 mx-4 transition-all border rounded-sm border-border-light" type="password" value={password} onChange={e => setPassword(e.target.value)} />
					</div>

					<button
						className={cx("px-6 py-2 mx-auto block text-sm text-green transition-all rounded-full opacity-80 hover:opacity-100 border-green border font-medium", { "opacity-50": isLoading })}
						disabled={isLoading}
						type="submit">
						Sign in
					</button>
				</form>

				{error && errorElement(error)}

				<p className="mt-4 text-center text-text-light">
					<span className="me-2">No account?</span>
					<Link to="/signup" className="font-medium text-green ">
						Create one
					</Link>
				</p>
			</div>
		</main>
	);
}

export default Login;
