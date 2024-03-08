import { useAuthContext } from "./useAuthContext";
import { LOGOUT } from "../utils/types";
import { cookies } from "../utils";

export const useLogout = () => {
	const { dispatch } = useAuthContext();

	const logout = () => {
		cookies.remove("email");
		cookies.remove("userId");
		localStorage.removeItem("user");
		location.reload();

		// memory
		dispatch({ type: LOGOUT });
	};

	return { logout };
};
