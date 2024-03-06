import { RouterProvider, createBrowserRouter } from "react-router-dom";

// pages
import RootLayout from "./pages/RootLayout";
import ErrorLayout from "./pages/ErrorLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import ProfileLayout, { loader as ProfileLoader } from "./pages/ProfileLayout";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Followers from "./pages/Followers";
import Following from "./pages/Following";

import Settings from "./pages/Settings";
import Article from "./pages/Article";
import NewStory from "./pages/NewStory";

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		errorElement: <ErrorLayout />,
		children: [
			{ index: true, element: <Home /> },
			{ path: "login", element: <Login /> },
			{ path: "signup", element: <Signup /> },
			{
				path: ":userId",
				element: <ProfileLayout />,
				loader: ProfileLoader,
				children: [
					{ index: true, element: <Profile /> },
					{ path: "about", element: <About /> },
					{ path: "followers", element: <Followers /> },
					{ path: "following", element: <Following /> },
				],
			},
			{ path: ":userId/settings", element: <Settings /> },
			{ path: ":userId/:articleId", element: <Article /> },
			{ path: "/new-story", element: <NewStory /> },
		],
	},
]);

export default function App() {
	return <RouterProvider router={router} />;
}
