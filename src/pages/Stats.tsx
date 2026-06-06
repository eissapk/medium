import { useEffect, useMemo, useState } from "react";
import { fetchAPI } from "../utils";
import { defer, useLoaderData } from "react-router-dom";
import cx from "classnames";
import Spinner from "../components/Spinner";
import { Search } from "../assets/icons";

const getKeys = (json: object, shouldReverse: boolean = true) => {
	if (shouldReverse) return Object.keys(json).reverse();
	return Object.keys(json);
};

function StatCard({ label, value }: { label: string; value: number }) {
	return (
		<div className="px-5 py-4 border rounded-lg border-border-light bg-input">
			<p className="mb-1 text-xs font-medium tracking-widest uppercase text-text-light">{label}</p>
			<p className="text-2xl font-medium text-text-dark">{value.toLocaleString()}</p>
		</div>
	);
}

function MetaItem({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<span className="inline-flex flex-col gap-0.5 px-3 py-2 text-xs rounded-md bg-white border border-border-light sm:min-w-[7rem]">
			<span className="font-medium tracking-wide uppercase text-text-light">{label}</span>
			<span className="text-sm text-text-dark">{children}</span>
		</span>
	);
}

function VisitorRow({ item }: { item: any }) {
	const deviceLabel = item.device ? (
		<>
			<span className="text-green">{item.device?.type}</span>
			{item.device?.model || item.device?.vendor ? ` ${[item.device?.model, item.device?.vendor].filter(Boolean).join(" ")}` : ""}
		</>
	) : (
		<span className="text-green">Desktop</span>
	);

	return (
		<li className="py-5 border-b border-border-light last:border-none">
			<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
				<time className="shrink-0 text-sm text-text-light" dateTime={new Date(item.time).toISOString()}>
					{new Date(item.time).toLocaleString("en-AU", {
						day: "numeric",
						month: "short",
						year: "numeric",
						hour: "2-digit",
						minute: "2-digit",
					})}
				</time>

				<div className="flex flex-wrap gap-2">
					{item.browser && (
						<MetaItem label="Browser">
							{item.browser?.name} {item.browser?.major}
						</MetaItem>
					)}
					{item.os && (
						<MetaItem label="OS">
							{item.os?.name} {item.os?.version}
						</MetaItem>
					)}
					{item.cpu && <MetaItem label="CPU">{item.cpu?.architecture}</MetaItem>}
					<MetaItem label="Device">{deviceLabel}</MetaItem>
					{item.geo && (
						<MetaItem label="Location">
							{item.geo?.city}, {item.geo?.country}
							{item.geo?.region ? ` · ${item.geo.region}` : ""}
						</MetaItem>
					)}
				</div>
			</div>

			{(item.robot || item.scraper) && (
				<div className="flex flex-wrap gap-2 mt-3">
					{item.robot && <span className="px-2 py-0.5 text-xs font-medium rounded-full text-green bg-red-light">Bot</span>}
					{item.scraper && <span className="px-2 py-0.5 text-xs font-medium rounded-full text-green bg-red-light">Scraper</span>}
				</div>
			)}
		</li>
	);
}

function Stats() {
	const { data } = useLoaderData() as { data: any };
	const [countries, setCountries] = useState<string[]>([]);
	const [isLoading, setIsloading] = useState(true);
	const [isError, setIsError] = useState(false);
	const [list, setList] = useState<any[]>([]);
	const [filteredList, setFilteredList] = useState<any[]>([]);
	const [query, setQuery] = useState("");

	const getCountries = (res: object): string[] => {
		if (!res) return [];
		const keys = getKeys(res, false);
		const obj: Record<string, string> = {};
		keys.forEach((key: string) => {
			// @ts-expect-error -- TODO handle this case with suitable type
			const country = res[key].geo.country || res[key].geo.city;
			if (!obj[country]) obj[country] = key;
		});
		return getKeys(obj, false);
	};

	useEffect(() => {
		data
			.then((res: any) => {
				const obj: Record<string, any> = {};
				let finalArr: any[] = [];
				const keys = getKeys(res);

				keys.forEach((key: string) => {
					if (!obj[res[key].ua + "_" + res[key].timeZone]) obj[res[key].ua + "_" + res[key].timeZone] = res[key];
				});

				getKeys(obj).forEach((key: string) => finalArr.push(obj[key]));
				finalArr = finalArr.sort((a: any, b: any) => b.time - a.time);

				setList(finalArr);
				setFilteredList(finalArr);
				setIsloading(false);
				setCountries(getCountries(res));
			})
			.catch(() => {
				setIsloading(false);
				setIsError(true);
			});
	}, [data]);

	const summary = useMemo(() => {
		const bots = list.filter(item => item.robot || item.scraper).length;
		const mobile = list.filter(item => item.device?.type && item.device.type !== "desktop").length;
		return {
			visitors: list.length,
			countries: countries.length,
			bots,
			mobile,
		};
	}, [list, countries]);

	const filter = (searchQuery: string) => {
		setQuery(searchQuery);
		const result = list.filter((item: any) => {
			if (searchQuery === "") return item;
			const normalized = searchQuery.toLowerCase();
			return item.geo?.country?.toLowerCase()?.includes(normalized) || item.timeZone.toLowerCase().includes(normalized);
		});
		setFilteredList(result);
	};

	return (
		<main className="px-4 py-10 mx-auto max-w-max">
			<header className="mb-10">
				<h1 className="font-title text-[2.6rem] text-text-dark mb-3">Site stats</h1>
				<p className="max-w-2xl font-desc text-sm leading-relaxed text-text-light">
					Anonymous visitor analytics — browser, device, and location data collected on each visit.
				</p>
			</header>

			{isLoading && !isError && (
				<div className="flex flex-col gap-4 max-w-3xl">
					<Spinner isLine />
					<Spinner isLine />
					<Spinner isLine />
				</div>
			)}

			{!isLoading && isError && (
				<div className="max-w-xl p-4 text-sm text-center border rounded text-text-light bg-red-light border-border-light">
					Couldn&apos;t fetch visitor data. Please try again later.
				</div>
			)}

			{!isLoading && !isError && !list.length && (
				<div className="max-w-xl p-8 text-center border rounded border-border-light bg-input">
					<p className="mb-1 font-medium text-text-dark">No visits recorded yet</p>
					<p className="text-sm text-text-light">Stats will appear here once readers start browsing the site.</p>
				</div>
			)}

			{!isLoading && !isError && !!list.length && (
				<>
					<div className="grid grid-cols-2 gap-4 mb-10 md:grid-cols-4">
						<StatCard label="Unique visitors" value={summary.visitors} />
						<StatCard label="Countries" value={summary.countries} />
						<StatCard label="Mobile visits" value={summary.mobile} />
						<StatCard label="Bots detected" value={summary.bots} />
					</div>

					<div className="mb-8">
						<label htmlFor="country" className="block mb-2 text-xs font-medium tracking-widest uppercase text-text-light">
							Filter by country or timezone
						</label>
						<div className="relative flex items-center rounded-[1.25rem] bg-input max-w-md">
							<Search className="absolute w-5 h-5 pointer-events-none ms-4 text-text-light" />
							<input
								onChange={e => filter(e.target.value)}
								value={query}
								list="countries"
								name="country"
								id="country"
								type="text"
								autoFocus
								className="w-full py-2.5 text-sm bg-transparent border-none outline-none ps-12 pe-4 placeholder:text-text-light"
								placeholder="Search by country or timezone..."
							/>
						</div>
						<datalist id="countries">
							{countries.map((c: string) => (
								<option key={c} value={c} />
							))}
						</datalist>
						<p className="mt-3 text-xs text-text-light">
							Showing {filteredList.length.toLocaleString()} of {list.length.toLocaleString()} visitors
						</p>
					</div>

					{filteredList.length ? (
						<ul className="border-t border-border-light">
							{filteredList.map((item: any) => (
								<VisitorRow key={item.time} item={item} />
							))}
						</ul>
					) : (
						<div className={cx("p-8 text-center border rounded border-border-light bg-input")}>
							<p className="mb-1 font-medium text-text-dark">No matches found</p>
							<p className="text-sm text-text-light">Try a different country or timezone.</p>
						</div>
					)}
				</>
			)}
		</main>
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
