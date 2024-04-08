import { createContext, useReducer } from "react";
import { SET_CURRENT_PROFILE, SET_LOGGED_PROFILE } from "../utils/types";

type ProfileContextType = {
	state: {
		profile: {
			logged: null;
			current: null;
		};
	};
	dispatch: React.Dispatch<any>;
};
export const ProfileContext = createContext<ProfileContextType>({ state: { profile: { logged: null, current: null } }, dispatch: () => {} });

const reducer = (state: any, action: any) => {
	switch (action.type) {
		case SET_LOGGED_PROFILE:
			return { profile: { logged: { ...action.payload }, current: { ...state.profile.current } } };
		case SET_CURRENT_PROFILE:
			return { profile: { current: { ...action.payload }, logged: { ...state.profile.logged } } };
		default:
			return state;
	}
};

const ProfileContextProvier = ({ children }: { children: React.ReactNode }) => {
	const [state, dispatch] = useReducer(reducer, { profile: { logged: null, current: null } });
	// console.log("profile context", state);

	return <ProfileContext.Provider value={{ dispatch, state }}>{children}</ProfileContext.Provider>;
};

export default ProfileContextProvier;
