import { useAuthContext } from "./useAuthContext";
import { LOGOUT } from "../utils/types";
import { cookies } from "../utils";

export const useLogout = () => {
	const { dispatch } = useAuthContext();

	const logout = () => {
		// cookies
		cookies.remove("email");
		cookies.remove("username");
		cookies.remove("userId");
		// memory
		dispatch({ type: LOGOUT });

		location.reload();
	};

	return { logout };
};
