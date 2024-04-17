import { createContext, useEffect, useReducer } from "react";
import { LOGIN, LOGOUT } from "../utils/types";
import { cookies } from "../utils";

type ContextType = {
	state: { user: { email: ""; _id: ""; avatar: ""; username: "" } };
	dispatch: React.Dispatch<any>;
};
export const AuthContext = createContext<ContextType>({ state: { user: { email: "", _id: "", avatar: "", username: "" } }, dispatch: () => {} });

const reducer = (state: any, action: any) => {
	switch (action.type) {
		case LOGIN:
			return { user: action.payload };
		case LOGOUT:
			return { user: null };
		default:
			return state;
	}
};

const AuthContextProvier = ({ children }: { children: React.ReactNode }) => {
	const [state, dispatch] = useReducer(reducer, { user: null });
	console.log("auth context", state);

	// make user auto login
	useEffect(() => {
		const email = cookies.get("email"); // set by server
		const _id = cookies.get("username") || cookies.get("userId"); // set by server
		const username = cookies.get("username"); // set by server
		// todo: handle avatar url by server
		if (email && _id) {
			dispatch({ type: LOGIN, payload: { email, _id, username, avatar: "" } });
		}
	}, []);

	return <AuthContext.Provider value={{ dispatch, state }}>{children}</AuthContext.Provider>;
};

export default AuthContextProvier;
