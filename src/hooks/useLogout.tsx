import { useAuthContext } from "./useAuthContext";
import { LOGOUT } from "../utils/types";

export const useLogout = () => {
	const { dispatch } = useAuthContext();

	const logout = () => {
		// auto logout
		localStorage.removeItem("token");
		localStorage.removeItem("user");

		// memory
		dispatch({ type: LOGOUT });
	};

	return { logout };
};
