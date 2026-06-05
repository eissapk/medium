import Header from "../components/Header";
import TrendingArticles from "../components/TrendingArticles";
import Feeds from "../components/Feeds";
import { useAuthContext } from "../hooks/useAuthContext";

function Home() {
	const { state } = useAuthContext();
	return (
		<>
			{!state.user && <Header />}
			{!state.user && <TrendingArticles />}
			{state.user && <Feeds />}
		</>
	);
}

export default Home;
