var OFF = 0,
	WARN = 1,
	ERROR = 2;

module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	overrides: [
		{
			env: {
				node: true,
			},
			files: [".eslintrc.{js,cjs}"],
			parserOptions: {
				sourceType: "script",
			},
			rules: {
				"@typescript-eslint/no-explicit-any": ERROR,
				"@typescript-eslint/ban-types": [
					"warn",
					{
						// fix this
						types: {
							unknown: "Use a better type please",
							// fix this, make it works also on save
							Function: {
								message: "Function is too generic. Use ()=> instead.",
								fixWith: "() => void",
							},
						},
					},
				],
			},
		},
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
	},
	plugins: ["@typescript-eslint"],
	rules: {
		// "no-undef": OFF,
		// "react-native/no-inline-styles": OFF,
		semi: [ERROR, "always"],
		quotes: [WARN, "double"],
	},
};
