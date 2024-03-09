import { useAuthContext } from "./useAuthContext";
import { LOGOUT } from "../utils/types";
import { cookies } from "../utils";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
	const { dispatch } = useAuthContext();
	const navigate = useNavigate();

	const logout = () => {
		cookies.remove("email");
		cookies.remove("userId");
		localStorage.removeItem("user");
		setTimeout(() => navigate("/"), 200);

		// memory
		dispatch({ type: LOGOUT });
	};

	return { logout };
};
