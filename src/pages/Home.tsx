import Header from "../components/Header";
import LatestArticles from "../components/LatestArticles";
import Feeds from "../components/Feeds";
import Footer from "../components/Footer";

// todo: handle loggedin state with context and useReducer or use redux
const logged = true;
function Home() {
	return (
		<>
			{!logged && <Header />}
			{!logged && <LatestArticles />}
			{logged && <Feeds />}
			<Footer />
		</>
	);
}

export default Home;
