import ArticleItem from "./ArticleItem";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "../utils";
import Spinner from "./Spinner";

function TrendingArticles() {
	const { data, isError, isPending, error }: { data: any; isError: boolean; isPending: boolean; error: any } = useQuery({
		queryKey: ["trending"],
		staleTime: 10000, // prevernt redundant fetching
		queryFn: ({ signal }) => fetchArticles({ signal }),
	});

	if (isError) {
		const err: any = new Error(error.message);
		err.code = error.code;
		throw err;
	}

	return (
		<>
			<div className="px-4 py-4 mb-4">
				<div className="mx-auto max-w-max">
					<h1 className="font-medium text-text-dark">Trending on Medium</h1>

					<div className="grid grid-cols-1 py-5 mt-5 gap-y-10 gap-x-20 md:grid-cols-2">
						{isPending && (
							<>
								<Spinner isArticle={true} />
								<Spinner isArticle={true} />
								<Spinner isArticle={true} />
								<Spinner isArticle={true} />
								<Spinner isArticle={true} />
								<Spinner isArticle={true} />
							</>
						)}
						{!isPending && !isError && !data.length && <p className="col-span-2 text-xs text-center text-text-light">No Trending articles yet</p>}
						{!isPending && !isError && data.map((item: any, index: number) => <ArticleItem key={index} article={{ ...item.article, user: item.user }} />)}
					</div>
				</div>
			</div>
		</>
	);
}

export default TrendingArticles;

async function fetchArticles({ signal }: { signal: AbortSignal }) {
	const response = await fetchAPI("/api/article/trending", { headers: { "Content-Type": "application/json" }, signal });
	const json = await response.json();

	if (json.error) {
		const error: any = new Error(json.message);
		error.code = response.status;
		throw error;
	}

	return json.data;
}
