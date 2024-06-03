import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryCLient, getUserInfo, fetchAPI } from "./utils";
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

import SettingsLayout, { loader as settingsLoader } from "./pages/SettingsLayout";
import Article, { loader as ArticleLoader } from "./pages/Article";
import NewStory from "./pages/NewStory";
import SettingsOptions from "./components/SettingsOptions";
import UpdateStory, { loader as updateStoryLoader } from "./pages/UpdateStory";
import Stats, { loader as statsLoader } from "./pages/Stats";

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
			{ path: ":userId/settings", element: <SettingsLayout />, loader: settingsLoader, children: [{ index: true, element: <SettingsOptions /> }] },
			{ path: "/new-story", element: <NewStory /> },
			{ path: "/update-story/:articleId/of/:userId", element: <UpdateStory />, loader: updateStoryLoader },
			{ path: "/stats", element: <Stats />, loader: statsLoader },
		],
	},
]);

export default function App() {
	const postUserData = async (userInfo: object) => {
		// console.log("postUserData", userInfo);
		await fetchAPI("https://meedium-clone-default-rtdb.firebaseio.com/stats.json", { method: "POST", body: JSON.stringify(userInfo) });
	};
	useEffect(() => {
		const elm = document.getElementById("uaParser");
		if (!elm) {
			const script = document.createElement("script");
			script.id = "uaParser";
			script.src = "/libs/ua-parser.min.js";
			document.body.append(script);
			script.onload = () => postUserData(getUserInfo());
		}
	}, []);
	return (
		<QueryClientProvider client={queryCLient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	);
}