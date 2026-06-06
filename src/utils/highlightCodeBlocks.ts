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

async function copyToClipboard(text: string) {
	if (navigator.clipboard?.writeText) {
		await navigator.clipboard.writeText(text);
		return;
	}

	const input = document.createElement("textarea");
	input.value = text;
	input.style.cssText = "position:absolute; opacity:0; z-index:-1; left:0; top:0; pointer-events:none";
	document.body.append(input);
	input.select();
	document.execCommand("copy");
	input.remove();
}

function createCopyButton(code: string) {
	const button = document.createElement("button");
	button.type = "button";
	button.className = "article-code-copy";
	button.textContent = "Copy";
	button.setAttribute("aria-label", "Copy code");

	button.addEventListener("click", async () => {
		try {
			await copyToClipboard(code);
			button.textContent = "Copied!";
			window.setTimeout(() => {
				button.textContent = "Copy";
			}, 2000);
		} catch {
			button.textContent = "Failed";
			window.setTimeout(() => {
				button.textContent = "Copy";
			}, 2000);
		}
	});

	return button;
}

export function highlightCodeBlocks(container: HTMLElement) {
	container.querySelectorAll(".ce-code textarea").forEach((textarea) => {
		const code = (textarea as HTMLTextAreaElement).value || textarea.textContent || "";
		if (!code.trim()) return;

		const { value, language } = hljs.highlightAuto(code, COMMON_LANGUAGES);
		const wrapper = textarea.closest(".ce-code");
		if (!wrapper) return;

		const block = document.createElement("div");
		block.className = "article-code-wrapper";

		const copyButton = createCopyButton(code);

		const pre = document.createElement("pre");
		const codeEl = document.createElement("code");
		codeEl.className = language ? `hljs language-${language}` : "hljs";
		codeEl.innerHTML = value;
		pre.appendChild(codeEl);
		pre.className = "article-code-block";

		block.append(copyButton, pre);
		wrapper.replaceChildren(block);
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
