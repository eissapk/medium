import { useContext } from "react";
import { AuthContext } from "../store/AuthContext";

export const useAuthContext = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuthContext must be used within an AuthContextProvider");
	}
	return ctx;
};
