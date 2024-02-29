import { Link } from "react-router-dom";
function Signup() {
	return (
		<div className="text-center">
			<h1>Join Medium</h1>

			<form className="">
				<div className="m-2">
					<label>Your email</label>
					<input className=" outline-dashed outline-1 ml-1" type="email" />
				</div>
				<div className="m-2">
					<label>Your password</label>
					<input className=" outline-dashed outline-1 ml-1" type="password" />
				</div>
				<button className="bg-main">Sign up</button>
			</form>
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
