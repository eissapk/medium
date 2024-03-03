export function getLocalTime(date, format = "long") {
	const t = new Date(date).toString();
	if (format === "short") return `${t.split(" ")[1]} ${t.split(" ")[3]}`;
	return `${t.split(" ")[1]} ${t.split(" ")[2]}, ${t.split(" ")[3]}`;
}
export const cap = text => {
	return text
		.toLowerCase()
		.split(" ")
		.map(function (word) {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");
};
