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
	const openTagRegex = /<[a-z]+(>|.*?[^?]>)/g; // open and self-closing
	const closeTagRegex = /<\/[a-z]+(>|.*?[^?]>)/g; // close
	return blocks
		.map((item: any) => {
			if (!["list", "delimiter", "image"].includes(item.type)) return item.data.text;
			if (item.type == "list") return item.data.items.map((str: string) => str).join(" ");
		})
		.join(" ")
		.replace(openTagRegex, "")
		.replace(closeTagRegex, "");
};
export const getShortArticleTitle = (text: string) => {
	if (text.length > 40) return text.slice(0, 40).concat("...");
	else return text;
};

// let mode = "dev";
// mode = "prod";
export const fetchAPI = async (url: string, opts: object) => {
	// opts.headers["Access-Control-Allow-Origin"] = "https://meedium.onrender.com";
	// opts.headers["Access-Control-Allow-Credentials"] = true;
	// url = mode == "dev" ? url : "https://meedium.onrender.com" + url;
	return await fetch(url, opts);
};

export async function checkUsername(text: string) {
	// await new Promise(r => setTimeout(r, 500));
	const response = await fetchAPI("/api/user/username/" + text, { headers: { "Content-Type": "application/json" } });
	const json = await response.json();
	if (json.error) {
		const error: any = new Error(json.message);
		error.code = response.status;
		throw error;
	}
	return json.data;
}

export const deleteArticle = async ({ userId, articleId }: { userId: string; articleId: string }) => {
	// console.log({ userId, articleId });
	const response = await fetchAPI(`/api/article/${articleId}/of/${userId}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, credentials: "include" });
	const json = await response.json();
	if (json.error) {
		const error: any = new Error(json.message);
		error.code = response.status;
		throw error;
	}
	// console.log(json);
	return json.data;
};
