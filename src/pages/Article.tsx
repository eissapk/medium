import { useEffect } from "react";
import { useParams } from "react-router-dom";

function Article() {
	const params = useParams();
	useEffect(() => {
		console.log(params);
	}, [params]);
	return (
		<div>
			Article page
			<p>user id: {params.userId}</p>
			<p>article id: {params.articleId}</p>
		</div>
	);
}

export default Article;
