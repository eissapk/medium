import { useEffect, useState } from "react";
import { fetchAPI } from "../utils";
import { defer, useLoaderData } from "react-router-dom";
import cx from "classnames";

const StatsLoader = () => (
	<button type="button" className="inline-flex items-center px-4 py-2 text-sm font-semibold leading-6 text-white transition duration-150 ease-in-out rounded-md shadow cursor-not-allowed bg-green">
		<svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
			<circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
			<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
		</svg>
		Fetching...
	</button>
);
const getKeys = (json: object, shouldReverse: boolean = true) => {
	if (shouldReverse) return Object.keys(json).reverse(); // from the most recent to the oldest
	return Object.keys(json);
};

function Stats() {
	const { data } = useLoaderData() as { data: any };
	const [countries, setCountries] = useState([]);
	const [isLoading, setIsloading] = useState(true);
	const [isError, setIsError] = useState(false);
	const [list, setList] = useState([]);
	const [filteredList, setFilteredList] = useState([]);

	const getCountries = (res: object): string[] => {
		if (!res) return [];
		const keys = getKeys(res, false);
		const obj = {};
		keys.forEach((key: string) => {
			// @ts-expect-error -- TODO handle this case with suitable type
			if (!obj[res[key].geo.country]) obj[res[key].geo.country || res[key].geo.city] = key;
		});
		return getKeys(obj, false);
	};

	useEffect(() => {
		data
			.then((res: any) => {
				const obj = {};
				let finalArr: any = [];
				const keys = getKeys(res);

				// rmeove duplicates and bind unique keys only in obj variable
				keys.forEach((key: string) => {
					// @ts-expect-error -- TODO handle this case with suitable type
					if (!obj[res[key].ua + "_" + res[key].timeZone]) obj[res[key].ua + "_" + res[key].timeZone] = res[key];
				});

				// @ts-expect-error -- TODO handle this case with suitable type
				getKeys(obj).forEach((key: string) => finalArr.push(obj[key]));
				// console.log(obj);

				// sort final Arr from recent time to old one
				finalArr = finalArr.sort((a: any, b: any) => b.time - a.time);

				setList(finalArr);

				setFilteredList(finalArr);

				setIsloading(false);

				const result = getCountries(res);
				// @ts-expect-error -- TODO handle this case with suitable type
				setCountries(result);
			})
			.catch(() => {
				setIsloading(false);
				setIsError(true);
			});
	}, [data]);

	const filter = (query: string) => {
		const result = list.filter((item: any) => {
			if (query === "") return item;
			if (item.geo?.country?.toLowerCase()?.includes(query?.toLowerCase()) || item.timeZone.toLowerCase().includes(query.toLowerCase())) return item;
		});
		setFilteredList(result);
		console.log("filter", result);
	};
	const handleOnChange = (e: any) => {
		filter(e.target.value);
	};

	return (
		<div className="flex flex-col lg:items-center lg:justify-center my-4">
			{isLoading && !isError && <StatsLoader />}
			{!isLoading && !isError && !!list.length && (
				<>
					<h1 className="mb-2 text-sm text-center text-black-light">Countries count: {countries.length}</h1>
					<form className="flex justify-center w-full">
						<div className="w-[50%] mx-auto relative">
							<input
								onChange={e => handleOnChange(e)}
								list="countries"
								name="country"
								id="country"
								type="text"
								autoFocus
								className="w-full px-2 py-1 mx-auto mb-4 text-sm border rounded border-zinc-200"
								placeholder="Search by country.."
							/>
							<span className="absolute w-5 h-5 bg-white right-1 top-1"></span>
						</div>
						<datalist id="countries">
							{countries.map((c: string) => (
								<option key={c} value={c} />
							))}
						</datalist>
					</form>

					<ul className="w-full lg:w-fit">
						{filteredList.map((item: any, index: number, arr: any) => (
							<li
								key={item.time}
								className={cx("flex flex-col w-full gap-2 pb-2 mb-2 text-sm border-b lg:flex-row text-start text-zinc-400 border-zinc-200 ", { "border-none": index === arr.length - 1 })}>
								<div className="min-w-40">
									<span>{new Date(item.time).toLocaleString("en-AU")}</span>
								</div>

								<div className="flex flex-col items-center justify-between gap-2 lg:flex-row">
									{/* browser */}
									{item.browser && (
										<span className=" min-w-44 lg:text-center">
											<span className="me-1 text-black-dark">Browser</span>
											<span>
												{item.browser?.name} {item.browser?.major}
											</span>
										</span>
									)}
									{/* os */}
									{item.os && (
										<span className="min-w-32 lg:text-center">
											<span className="me-1 text-black-dark">OS</span>
											<span>
												{item.os?.name} {item.os?.version}
											</span>
										</span>
									)}
									{/* cpu */}
									{item.cpu && (
										<span className="min-w-32 lg:text-center">
											<span className="me-1 text-black-dark">CPU</span>
											<span>{item.cpu?.architecture}</span>
										</span>
									)}
									{/* device */}
									{item.device && (
										<span className="min-w-32 lg:text-center">
											<span className="me-1 text-black-dark">Device</span>
											<span>
												<span className="text-green">{item.device?.type}</span> {item.device?.model} {item.device?.vendor}
											</span>
										</span>
									)}
									{!item.device && (
										<span className="min-w-32 lg:text-center">
											<span className="me-1 text-black-dark">Device</span>
											<span className="text-green">Desktop</span>
										</span>
									)}
								</div>
								{/* geo */}
								{item.geo && (
									<div className="flex items-center lg:text-center min-w-32">
										<span className="me-1 text-black-dark">State</span>
										<span>
											{item.geo?.city}, {item.geo?.country} | {item.geo?.region}
										</span>
									</div>
								)}
								{/* robot */}
								{item.robot && (
									<div className="flex items-center lg:text-center">
										<span className="text-xs me-1 text-green">Robot</span>
									</div>
								)}
								{/* web scraper */}
								{item.scraper && (
									<div className="flex items-center text-xs lg:text-center">
										<span className="me-1 text-green">scraper</span>
									</div>
								)}
							</li>
						))}
					</ul>
				</>
			)}
			{!isLoading && !isError && !list.length && <p className="text-center text-black-light">No data yet</p>}
			{!isLoading && isError && <p className="text-center text-black-light">Couldn't fetch data</p>}
		</div>
	);
}

export default Stats;

const getData = async () => {
	try {
		const response = await fetchAPI("https://meedium-clone-default-rtdb.firebaseio.com/stats.json", {});
		const json = await response.json();
		return json;
	} catch (error) {
		const err: any = new Error("Could not fetch data");
		err.code = 400;
		throw error;
	}
};
export const loader = async () => {
	return defer({ data: getData() });
};
