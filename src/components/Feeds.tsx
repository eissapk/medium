import { useQuery } from "@tanstack/react-query";
import ArticleItem from "./ArticleItem";
import Spinner from "./Spinner";
import { cookies, fetchAPI } from "../utils";
import { useLogout } from "../hooks/useLogout";

function Feeds() {
	const { logout } = useLogout();
	const userId = cookies.get("userId");
	if (!userId) logout();

	const {
		data: feeds,
		isPending,
		error,
		isError,
	}: {
		data: any;
		isPending: boolean;
		error: any;
		isError: boolean;
	} = useQuery({
		queryKey: ["feeds", userId],
		queryFn: ({ signal }) => fetchFeeds({ userId, signal }),
		staleTime: 10000, // prevernt redundant fetching
	});

	if (isError) {
		logout(); // fix a bug temporary
		const err: any = new Error(error.message);
		err.code = error.code;
		throw err;
	}

	return (
		<div className="px-4 py-4 mb-4">
			<div className="mx-auto max-w-max">
				<h1 className="inline-block pb-4 mt-6 text-sm font-medium border-b text-text-dark border-border-light pe-4">Latest from people you follow</h1>

				<div className="grid grid-cols-1 py-5 mt-5 gap-y-10 gap-x-20 md:grid-cols-2">
					{isPending && (
						<>
							<Spinner isArticle={true} />
							<Spinner isArticle={true} />
							<Spinner isArticle={true} />
							<Spinner isArticle={true} />
						</>
					)}
					{!isPending && !isError && !feeds.data.length && <p className="col-span-2 text-xs text-center text-text-light">No feeds yet</p>}
					{!isPending && !isError && feeds.data.map((item: any, index: number) => <ArticleItem key={index} article={item} />)}
				</div>
			</div>
		</div>
	);
}

export default Feeds;

async function fetchFeeds({ userId, signal }: { userId: string; signal: AbortSignal }) {
	// const response = await fetch(`/api/article/feeds/user/${userId}`, { headers: { "Content-Type": "application/json" }, signal, credentials: "include" });
	const response = await fetchAPI(`/api/article/feeds/user/${userId}`, { headers: { "Content-Type": "application/json" }, signal, credentials: "include" });
	const data = await response.json();

	// await new Promise(r => setTimeout(r, 500)); // for testing
	if (data.error) {
		const error: any = new Error(data.message);
		error.code = response.status;
		throw error;
	}

	return data;
}
