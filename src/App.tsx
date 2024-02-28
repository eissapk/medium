import { RouterProvider, createBrowserRouter } from "react-router-dom";

// pages
import RootLayout from "./pages/RootLayout";
import Error from "./pages/Error";
import Home from "./pages/Home";
import About from "./pages/About";

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		errorElement: <Error />,
		children: [
			{
				index: true,
				element: <Home />,
				// action:actionMethod,
				// loader:loaderMethod,
			},
			{
				path: "about",
				element: <About />,
			},
		],
	},
]);

export default function App() {
	return <RouterProvider router={router} />;
}
