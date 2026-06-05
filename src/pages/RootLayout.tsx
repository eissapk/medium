import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

function RootLayout() {
	return (
		<div className="flex flex-col min-h-screen">
			<Nav />
			<div className="flex-1">
				<Outlet />
			</div>
			<Footer />
		</div>
	);
}

export default RootLayout;
