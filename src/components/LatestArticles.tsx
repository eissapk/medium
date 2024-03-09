// todo create end point to get latest articles | copy feeds component code and modify it to suit your needs
import ArticleItem from "./ArticleItem";
const article = {
	_id: "65def0994a411947d2eb72e0",
	title: "Works in Progress: The Long Journey to Doing Good Better",
	thumbnail: "https://miro.medium.com/v2/resize:fit:1000/1*22QnF5qnl4TLN9b6TpYkHA.png",
	content: "The more I learn, the more I realize how much I don’t know. — Albert Einstein",
	readTime: 5,
	createdAt: "2024-02-28T08:36:41.731Z",
};
const user = {
	_id: "65deef664a411947d2eb72b7",
	avatar: "https://miro.medium.com/v2/resize:fill:44:44/1*pUa4O3SR1XTWUtUMhnrQUw.jpeg",
	name: "Dustin Moskovitz",
};
const dummyArray = [
	{
		article,
		user,
	},
	{
		article,
		user,
	},
	{
		article,
		user,
	},
	{
		article,
		user,
	},
	{
		article,
		user,
	},
];
function LatestArticles() {
	return (
		<>
			<div className="px-4 py-4 mb-4">
				<div className="mx-auto max-w-max">
					<h1 className="font-medium text-text-dark">Latest on Medium</h1>

					<div className="grid grid-cols-1 py-5 mt-5 gap-y-10 gap-x-20 md:grid-cols-2">
						{dummyArray.map((item, index) => (
							<ArticleItem key={index} article={item.article} user={item.user} />
						))}
					</div>
				</div>
			</div>
		</>
	);
}

export default LatestArticles;
