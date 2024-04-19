import adImg from "../assets/ad.png";
type AdProps = { link: string; img: string; description?: string };

const defaultAd = {
	link: "https://eissa.xyz",
	img: adImg, // image must be a square
	description: "MERN your next project? We can help. Let's chat!",
};

function Ad({ data = defaultAd }: { data?: AdProps }) {
	return (
		<div className="w-full items-center flex flex-col">
			{/* hint */}
			{/* <h2 className="text-2xl font-bold text-center text-text-light mb-2">Imagine your ad here.</h2> */}
			{/* image */}
			<a href={data.link}>
				<img className="border border-zinc-100 rounded w-full h-auto block" src={data.img} alt={data?.description || "Advertisement"} />
			</a>
			{/* description */}
			{data.description && (
				<a href={data.link} className="text-xs mt-2 text-text-light">
					{data.description}
				</a>
			)}
		</div>
	);
}

export default Ad;
