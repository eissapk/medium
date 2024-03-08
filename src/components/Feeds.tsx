import { useQuery } from "@tanstack/react-query";
import ArticleItem from "./ArticleItem";
import { useEffect } from "react";

const article = {
	_id: "65def0994a411947d2eb72e0",
	title: "Works in Progress: The Long Journey to Doing Good Better",
	thumbnail: "https://miro.medium.com/v2/resize:fit:1000/1*22QnF5qnl4TLN9b6TpYkHA.png",
	content: "The more I learn, the more I realize how much I don’t know. — Albert Einstein",
	readTime: 5,
	createdAt: "2024-02-28T08:36:41.731Z",
};
// const user = {
// 	_id: "65deef664a411947d2eb72b7",
// 	avatar: "https://miro.medium.com/v2/resize:fill:44:44/1*pUa4O3SR1XTWUtUMhnrQUw.jpeg",
// 	name: "Dustin Moskovitz",
// };
const user = JSON.parse(localStorage.getItem("user") as string) || {};
const dummyArray = [
	{
		article,
		user,
	},
];

function Feeds() {
	const {
		data: feeds,
		isLoading,
		error,
		isError,
	} = useQuery({
		queryKey: ["feeds", user._id],
		queryFn: ({ signal }) => fetchFeeds({ id: user._id, signal }),
	});

	useEffect(() => {
		console.log(feeds);
	}, [feeds]);

	if (isError) {
		const err = new Error(error.message);
		err.code = error.code;
		throw err;
	}

	return (
		<div className="px-4 py-4 mb-4">
			<div className="mx-auto max-w-max">
				<h1 className="inline-block pb-4 mt-6 text-sm border-b text-text-light border-border-light pe-2">Latest from people you follow</h1>

				<div className="grid grid-cols-1 py-5 mt-5 gap-y-10 gap-x-20 md:grid-cols-2">
					{dummyArray.map((item, index) => (
						<ArticleItem key={index} article={item.article} user={item.user} />
					))}
				</div>
			</div>
		</div>
	);
}

export default Feeds;

async function fetchFeeds({ id, signal }) {
	const response = await fetch(`/api/article/feeds/user/${id}`, { headers: { "Content-Type": "application/json" }, signal, credentials: "include" });
	const data = await response.json();

	if (data.error) {
		const error = new Error(data.message);
		error.code = response.status;
		throw error;
	}

	console.log("fetchFeeds:", data);

	return data;
}
