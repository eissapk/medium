import { useAuthContext } from "./useAuthContext";
import { LOGOUT } from "../utils/types";
import { cookies } from "../utils";

export const useLogout = () => {
	const { dispatch } = useAuthContext();

	const logout = () => {
		// memory
		dispatch({ type: LOGOUT });
		// cookies
		cookies.remove("email");
		cookies.remove("username");
		cookies.remove("userId");
	};

	return { logout };
};
