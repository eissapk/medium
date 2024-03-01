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
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errorPasswordMatch, setErrorPasswordMatch] = useState(false);

	useEffect(() => {
		if (state.user) navigate("/");
	}, [state.user, navigate]);
	async function handleSubmit(e) {
		e.preventDefault();
		if (password !== confirmPassword) return setErrorPasswordMatch(true);
		await signup(email, password);
	}
	return (
		<div className="text-center">
			<h1>Join Medium</h1>

			<form onSubmit={handleSubmit}>
				<div className="m-2">
					<label>Your email</label>
					<input className=" outline-dashed outline-1 ml-1" autoFocus type="email" value={email} onChange={e => setEmail(e.target.value)} />
				</div>
				<div className="m-2">
					<label>Your password</label>
					<input className=" outline-dashed outline-1 ml-1" type="password" value={password} onChange={e => setPassword(e.target.value)} />
				</div>
				<div className="m-2">
					<label>Confirm password</label>
					<input className=" outline-dashed outline-1 ml-1" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
				</div>

				{errorPasswordMatch && <div className="p-[10px] bg-[#ffefef] border border-error rounded-[4px] text-error my-5 mx-0 h-fit text-center">Password does not match</div>}
				<button className={cx("bg-main", { "opacity-50": isLoading })} disabled={isLoading} type="submit">
					Sign up
				</button>
			</form>
			{error && <div className="p-[10px] bg-[#ffefef] border border-error rounded-[4px] text-error my-5 mx-0 h-fit text-center">{error}</div>}
			<p>
				Already have an account?
				<Link to="/login" className="bg-main">
					Sign in
				</Link>
			</p>
		</div>
	);
}

export default Signup;
