import Header from "../components/Header";
import LatestArticles from "../components/LatestArticles";
import Feeds from "../components/Feeds";
import Footer from "../components/Footer";
import { useAuthContext } from "../hooks/useAuthContext";

function Home() {
	const { state } = useAuthContext();
	return (
		<>
			{!state.user && <Header />}
			{!state.user && <LatestArticles />}
			{state.user && <Feeds />}
			<Footer />
		</>
	);
}

export default Home;
