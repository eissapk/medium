import { useRouteError } from "react-router-dom";

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
		<>
			<h1>{title}</h1>
			<p>{message}</p>
		</>
	);
}

export default Error;
