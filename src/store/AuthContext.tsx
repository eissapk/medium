import { createContext, useEffect, useReducer } from "react";
import { LOGIN, LOGOUT } from "../utils/types";
import { cookies } from "../utils";

export const AuthContext = createContext({});

const reducer = (state, action) => {
	switch (action.type) {
		case LOGIN:
			return { user: action.payload };
		case LOGOUT:
			return { user: null };
		default:
			return state;
	}
};

const AuthContextProvier = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, { user: null });
	console.log("auth context", state);

	// make user auto login
	useEffect(() => {
		const email = cookies.get("email"); // set by server (httpOnly)
		const userId = cookies.get("userId"); // set by server (httpOnly)
		const user = localStorage.getItem("user");
		if (user && email && userId) {
			dispatch({ type: LOGIN, payload: { email, userId } });
		}
	}, []);

	return <AuthContext.Provider value={{ dispatch, state }}>{children}</AuthContext.Provider>;
};

export default AuthContextProvier;
