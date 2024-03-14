import { useAuthContext } from "./useAuthContext";
import { LOGOUT } from "../utils/types";
import { cookies } from "../utils";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
	const { dispatch } = useAuthContext();
	const navigate = useNavigate();

	const logout = () => {
		cookies.remove("email");
		cookies.remove("username");
		cookies.remove("userId");
		setTimeout(() => {
			navigate("/");
			location.reload();
		}, 200);

		// memory
		dispatch({ type: LOGOUT });
	};

	return { logout };
};
