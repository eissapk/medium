import { useAuthContext } from "./useAuthContext";
import { LOGOUT } from "../utils/types";
import { cookies } from "../utils";

export const useLogout = () => {
	const { dispatch } = useAuthContext();

	// todo: fix when use logs out and reloads the page the cookies gets back again or not cleared at all
	const logout = (cb: () => void) => {
		// cookies
		cookies.remove("userId");
		cookies.remove("email");
		cookies.remove("username");
		// memory
		dispatch({ type: LOGOUT });
		if (cb) cb();
	};

	return { logout };
};
