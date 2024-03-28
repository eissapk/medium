import AuthContextProvier from "./store/AuthContext.tsx";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as Element).render(
	<AuthContextProvier>
		<App />
	</AuthContextProvier>
);