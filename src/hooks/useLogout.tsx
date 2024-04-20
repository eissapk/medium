import { useAuthContext } from "./useAuthContext";
import { LOGOUT } from "../utils/types";
import { cookies } from "../utils";

const expires = "expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;";
export const useLogout = () => {
	const { dispatch } = useAuthContext();

	// todo: fix when use logs out and reloads the page the cookies gets back again or not cleared at all
	const logout = (cb?: () => void) => {
		// cookies
		cookies.remove("username");
		cookies.remove("userId");
		cookies.remove("email");
		cookies.remove("avatar");
		// fallback -- if it didn't work then clear cookies from server via logout endpoint
		document.cookie = "username=;" + expires;
		document.cookie = "userId=;" + expires;
		document.cookie = "email=;" + expires;
		document.cookie = "avatar=;" + expires;

		// memory
		dispatch({ type: LOGOUT });
		if (cb) cb();
	};

	return { logout };
};
