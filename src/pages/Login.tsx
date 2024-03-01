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
	return (
		<div className="text-center">
			<h1>Welcome back.</h1>

			<form onSubmit={handleSubmit}>
				<div className="m-2">
					<label>Your email</label>
					<input className=" outline-dashed outline-1 ml-1" autoFocus type="email" value={email} onChange={e => setEmail(e.target.value)} />
				</div>
				<div className="m-2">
					<label>Your password</label>
					<input className=" outline-dashed outline-1 ml-1" type="password" value={password} onChange={e => setPassword(e.target.value)} />
				</div>
				<button className={cx("", { "opacity-50": isLoading })} type="submit" disabled={isLoading}>
					Sign in
				</button>
			</form>

			{error && <div className="p-[10px] bg-[#ffefef] border border-error rounded-[4px] text-error my-5 mx-0 h-fit text-center">{error}</div>}

			<p>
				No account?
				<Link to="/signup" className="bg-main">
					Create one
				</Link>
			</p>
		</div>
	);
}

export default Login;
