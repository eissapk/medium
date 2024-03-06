import { useRouteError } from "react-router-dom";
import { Link } from "react-router-dom";

function Error() {
	const err = useRouteError();
	console.log(err);

	let title = "An error occurred";
	let message = "Something went wrong";

	if (err.status === 500) message = err.data.message;
	if (err.status === 404) {
		title = "Not found";
		message = "Could not find resource";
	}

	return (
		<div className="h-[100vh] grid justify-center text-center content-center">
			<div>
				<h1 className="text-3xl text-center font-title text-black-200">{title}</h1>
				<p className="block my-5 text-sm font-medium text-text-light">{message}</p>

				<Link to="/" className="px-6 py-2 mx-auto text-sm font-medium transition-all border rounded-full text-green opacity-80 hover:opacity-100 border-green">
					Back to home page
				</Link>
			</div>
		</div>
	);
}

export default Error;
