import { useRouteError } from "react-router-dom";
import { Link } from "react-router-dom";

function Error() {
	const err: any = useRouteError();

	// console.log("message:", err.message);
	// console.log("code:", err.code);

	let title = "An error occurred";
	const message = err.message || "Something went wrong";

	switch (err.code) {
		case 400:
			title = "Bad request";
			break;
		case 401:
			title = "Unauthorized";
			break;
		case 403:
			title = "Forbidden";
			break;
		case 404:
			title = "Not found";
			break;
		case 405:
			title = "Method not allowed";
			break;
		case 500:
			title = "Internal server error";
			break;
		case 501:
			title = "Method not implemented";
			break;
		case 502:
			title = "Bad gateway";
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
