import { createContext, useEffect, useReducer } from "react";
import { LOGIN, LOGOUT } from "../utils/types";

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
		const token = JSON.parse(localStorage.getItem("token") as string);
		const user = JSON.parse(localStorage.getItem("user") as string);
		if (token && user) {
			dispatch({ type: LOGIN, payload: user });
		}
	}, []);

	return <AuthContext.Provider value={{ dispatch, state }}>{children}</AuthContext.Provider>;
};

export default AuthContextProvier;
