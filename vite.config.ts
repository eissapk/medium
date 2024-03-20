import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default ({ mode }) => {
	// process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

	return defineConfig({
		server: {
			proxy: {
				"/api": {
					target: mode == "development" ? "http://localhost:3000" : "https://medium-3k4o.onrender.com",
					// target: process.env.VITE_mainAPI_host,
					// secure: true,
					changeOrigin: true,
					//   rewrite: (path) => path.replace(/^\/api/, ''),
				},
			},
		},
		plugins: [react()],
	});
};
