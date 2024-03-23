import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default ({ mode }) => {
	return defineConfig({
		server: {
			proxy: {
				"/api": {
					target: "http://localhost:3000",
					// target: mode == "development" ? "http://localhost:3000" : "https://medium-3k4o.onrender.com",
					changeOrigin: true,
				},
			},
		},
		plugins: [react()],
	});
};
