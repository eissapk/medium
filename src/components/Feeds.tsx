import { useQuery } from "@tanstack/react-query";
import ArticleItem from "./ArticleItem";
import Spinner from "./Spinner";
// import { useLogout } from "../hooks/useLogout";

function Feeds() {
	const user = JSON.parse(localStorage.getItem("user") as string) || {};
	// const { logout } = useLogout();

	const {
		data: feeds,
		isPending,
		error,
		isError,
	} = useQuery({
		queryKey: ["feeds", user._id],
		queryFn: ({ signal }) => fetchFeeds({ id: user._id, signal }),
		staleTime: 10000, // prevernt redundant fetching
	});

	if (isError) {
		// logout(); // fix a bug temporary
		const err = new Error(error.message);
		err.code = error.code;
		throw err;
	}

	return (
		<div className="px-4 py-4 mb-4">
			<div className="mx-auto max-w-max">
				<h1 className="inline-block pb-4 mt-6 font-medium text-sm border-b text-text-dark border-border-light pe-4">Latest from people you follow</h1>

				<div className="grid grid-cols-1 py-5 mt-5 gap-y-10 gap-x-20 md:grid-cols-2">
					{isPending && (
						<>
							<Spinner isArticle={true} />
							<Spinner isArticle={true} />
							<Spinner isArticle={true} />
							<Spinner isArticle={true} />
						</>
					)}
					{!isPending && !isError && !feeds.data.length && <p className="text-xs text-center text-text-light col-span-2">No feeds yet</p>}
					{/* todo: need to bind user data in feeds response to each object in the array (email, name, avatar) */}
					{!isPending && !isError && feeds.data.map((item, index) => <ArticleItem key={index} article={item} user={item.user} />)}
				</div>
			</div>
		</div>
	);
}

export default Feeds;

async function fetchFeeds({ id, signal }) {
	const response = await fetch(`/api/article/feeds/user/${id}`, { headers: { "Content-Type": "application/json" }, signal, credentials: "include" });
	const data = await response.json();

	await new Promise(r => setTimeout(r, 500)); // for testing
	if (data.error) {
		const error = new Error(data.message);
		error.code = response.status;
		throw error;
	}

	return data;
}
