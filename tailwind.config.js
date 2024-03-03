/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		screens: {
			xs: "320px",
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1536px",
		},
		extend: {
			colors: {
				yellow: "#ffc017",
				green: "#1a8917",
				main: "#242424",
				text: {
					dark: "#242424",
					light: "#6B6B6B",
				},
				black: {
					100: "#242424",
					200: "#191919",
					900: "#000000",
				},
				border: {
					dark: "#242424",
					light: "#f2f2f2",
				},
				input: "#f9f9f9",
			},
			fontFamily: {
				main: ["sohne", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
				title: ["gt-super", "Georgia", "Cambria", "Times New Roman", "Times", "serif"], // e.g. home page heading
				desc: ["source-serif-pro", "Georgia", "Cambria", "Times New Roman", "Times", "serif"], // article descriptions
				code: ["source-code-pro", "Menlo", "Monaco", "Courier New", "Courier", "monospace"], // code blocks in articles
			},
			boxShadow: {
				menu: "rgba(0, 0, 0, 0.05) 0px 0px 4px, rgba(0, 0, 0, 0.15) 0px 2px 8px",
			},
			maxWidth: {
				max: "80rem", // for centering containers on large screens
			},
		},
	},
	plugins: [],
};
