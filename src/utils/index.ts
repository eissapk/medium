import Cookies from "universal-cookie";
export const cookies = new Cookies();
import { QueryClient } from "@tanstack/react-query";
export const queryCLient = new QueryClient();

export function getLocalTime(date: string, format = "long") {
	const t = new Date(date).toString();
	if (format === "short") return `${t.split(" ")[1]} ${t.split(" ")[3]}`;
	return `${t.split(" ")[1]} ${t.split(" ")[2]}, ${t.split(" ")[3]}`;
}
export const cap = (text: string) => {
	return text
		.toLowerCase()
		.split(" ")
		.map(function (word) {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");
};

export const getNameFromEmail = (email: string) => email.split("@")[0];

export const getShortArticleDesc = (text: string) => {
	if (text.split(" ").length > 10) return text.split(" ").slice(0, 10).join(" ").concat("...");
	else return text;
};
export const getTextFromEditorBlocks = (blocks: any): string => {
	// todo: udpate these regexes with solid ones on regexer
	const openTagRegex = /<.*>/g;
	const closeTagRegex = /<\/.*>/g;
	const selfClosingTagregex = /<.*\/>/g;
	return blocks
		.map((item: any) => {
			if (!["list", "delimiter", "image"].includes(item.type)) return item.data.text;
			if (item.type == "list") return item.data.items.map((str: string) => str).join(" ");
		})
		.join(" ")
		.replace(openTagRegex, "")
		.replace(closeTagRegex, "")
		.replace(selfClosingTagregex, "");
};
export const getShortArticleTitle = (text: string) => {
	if (text.length > 40) return text.slice(0, 40).concat("...");
	else return text;
};

let mode = "dev";
mode = "prod";
export const fetchAPI = async (url: string, opts: object) => {
	// @ts-expect-error -- just testing cross origin cookies
	opts.headers["Access-Control-Allow-Origin"] = "https://meedium.onrender.com";
	// @ts-expect-error -- just testing cross origin cookies
	opts.headers["Access-Control-Allow-Credentials"] = true;
	url = mode == "dev" ? url : "https://meedium.onrender.com" + url;
	return await fetch(url, opts);
};
