import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryCLient } from "./utils";
import ProfileContextProvier from "./store/ProfileContext";
import { cookies } from "./utils";

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

import Settings from "./pages/Settings";
import Article, { loader as ArticleLoader } from "./pages/Article";
import NewStory from "./pages/NewStory";

const isLogged = (): boolean => {
	const email = cookies.get("email"); // set by server
	const _id = cookies.get("username") || cookies.get("userId"); // set by server
	return email && _id;
};

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
			{
				path: ":userId/settings",
				element: <Settings />,
				// @ts-expect-error -- todo: use a better approach instead of loader
				loader: () => (!isLogged() ? location.replace("/") : null),
			},
			{
				path: "/new-story",
				element: <NewStory />,
				// @ts-expect-error -- todo: use a better approach instead of loader
				loader: () => (!isLogged() ? location.replace("/") : null),
			},
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
