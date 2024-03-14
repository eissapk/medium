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

export const getShortArticleDesc = (text: string) => text.split(" ").slice(0, 10).join(" ").concat("...");
