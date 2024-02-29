import { Link } from "react-router-dom";
function Login() {
	return (
		<div className="text-center">
			<h1>Welcome back.</h1>

			<form className="">
				<div className="m-2">
					<label>Your email</label>
					<input className=" outline-dashed outline-1 ml-1" type="email" />
				</div>
				<div className="m-2">
					<label>Your password</label>
					<input className=" outline-dashed outline-1 ml-1" type="password" />
				</div>
				<button className="bg-main">Sign in</button>
			</form>
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
