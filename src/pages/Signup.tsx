import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import cx from "classnames";
import { useSignup } from "../hooks/useSignup";

function Signup() {
	const navigate = useNavigate();
	const { signup, error, isLoading } = useSignup();
	const { state } = useAuthContext();
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errorPasswordMatch, setErrorPasswordMatch] = useState(false);

	const errorElement = (text: string | boolean, className = "") => (
		<div className={`p-2.5 bg-red border border-border-light rounded my-4 text-center text-sm text-text-light ${className}`}>{text}</div>
	);
	useEffect(() => {
		if (state.user) navigate("/");
	}, [state.user, navigate]);
	async function handleSubmit(e: any) {
		e.preventDefault();
		if (password !== confirmPassword) return setErrorPasswordMatch(true);
		await signup(email, username, password);
	}
	return (
		<main className="flex justify-center">
			<div>
				<h1 className="mt-5 mb-10 text-3xl text-center font-title text-black-200">Join Medium.</h1>

				<form onSubmit={handleSubmit}>
					<div className="mb-2">
						<label className="font-medium inline-block text-sm text-text-light min-w-[7rem]">Your email</label>
						<input className="px-1 mx-4 transition-all border rounded-sm border-border-light" autoFocus type="email" value={email} onChange={e => setEmail(e.target.value)} />
					</div>
					<div className="mb-2">
						<label className="font-medium inline-block text-sm text-text-light min-w-[7rem]">Username</label>
						<input className="px-1 mx-4 transition-all border rounded-sm border-border-light" type="text" value={username} onChange={e => setUsername(e.target.value)} />
					</div>
					<div className="mb-2">
						<label className="font-medium inline-block text-sm text-text-light min-w-[7rem]">Your password</label>
						<input className="px-1 mx-4 transition-all border rounded-sm border-border-light" type="password" value={password} onChange={e => setPassword(e.target.value)} />
					</div>
					<div className="mb-4">
						<label className="font-medium inline-block text-sm text-text-light min-w-[7rem]">Confirm password</label>
						<input className="px-1 mx-4 transition-all border rounded-sm border-border-light" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
					</div>

					<button
						className={cx("px-6 py-2 mx-auto block text-sm text-green transition-all rounded-full opacity-80 hover:opacity-100 border-green border font-medium", { "opacity-50": isLoading })}
						disabled={isLoading}
						type="submit">
						Sign up
					</button>
				</form>

				{error && errorElement(error)}
				<br />
				{errorPasswordMatch && errorElement("Password does not match")}

				<p className="text-center text-text-light">
					<span className="me-2">Already have an account?</span>
					<Link to="/login" className="font-medium text-green ">
						Sign in
					</Link>
				</p>
			</div>
		</main>
	);
}

export default Signup;
