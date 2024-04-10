import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryCLient } from "./utils";
import ProfileContextProvier from "./store/ProfileContext";

// pages
import RootLayout from "./pages/RootLayout";
import ErrorLayout from "./pages/ErrorLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import ProfileLayout, { loader as ProfileLayoutLoader } from "./pages/ProfileLayout";
import Profile, { loader as ProfileLoader } from "./pages/Profile";
import About from "./pages/About";
import Followers from "./pages/Followers";
import Following from "./pages/Following";

import Settings, { loader as settingsLoader } from "./pages/Settings";
import Article, { loader as ArticleLoader } from "./pages/Article";
import NewStory from "./pages/NewStory";

//todo add  notification route
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
				element: (
					<ProfileContextProvier>
						<ProfileLayout />
					</ProfileContextProvier>
				),
				loader: ProfileLayoutLoader,
				children: [
					{ index: true, element: <Profile />, loader: ProfileLoader },
					{ path: "about", element: <About /> },
					{ path: "followers", element: <Followers /> },
					{ path: "following", element: <Following /> },
				],
			},
			{ path: ":userId/:articleId", element: <Article />, loader: ArticleLoader },
			{ path: ":userId/settings", element: <Settings />, loader: settingsLoader },
			{ path: "/new-story", element: <NewStory /> },
		],
	},
]);

export default function App() {
	return (
		<QueryClientProvider client={queryCLient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	);
}
