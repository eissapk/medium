import hljs from "highlight.js";

const COMMON_LANGUAGES = [
	"javascript",
	"typescript",
	"python",
	"java",
	"css",
	"html",
	"xml",
	"json",
	"bash",
	"shell",
	"sql",
	"go",
	"rust",
	"ruby",
	"php",
	"c",
	"cpp",
	"csharp",
	"swift",
	"kotlin",
	"yaml",
	"markdown",
];

export function highlightCodeBlocks(container: HTMLElement) {
	container.querySelectorAll(".ce-code textarea").forEach((textarea) => {
		const code = (textarea as HTMLTextAreaElement).value || textarea.textContent || "";
		if (!code.trim()) return;

		const { value, language } = hljs.highlightAuto(code, COMMON_LANGUAGES);
		const wrapper = textarea.closest(".ce-code");
		if (!wrapper) return;

		const pre = document.createElement("pre");
		const codeEl = document.createElement("code");
		codeEl.className = language ? `hljs language-${language}` : "hljs";
		codeEl.innerHTML = value;
		pre.appendChild(codeEl);
		pre.className = "article-code-block";
		wrapper.replaceChildren(pre);
	});
}

export function resizeCodeTextareas(container: HTMLElement) {
	const resize = (textarea: HTMLTextAreaElement) => {
		textarea.style.minHeight = "unset";
		textarea.style.height = "auto";
		textarea.style.overflow = "hidden";
		textarea.style.height = `${textarea.scrollHeight}px`;
	};

	container.querySelectorAll<HTMLTextAreaElement>(".ce-code textarea").forEach((textarea) => {
		resize(textarea);
		textarea.addEventListener("input", () => resize(textarea));
	});
}
