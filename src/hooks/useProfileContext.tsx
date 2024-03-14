import { useContext } from "react";
import { ProfileContext } from "../store/ProfileContext";

export const useProfileContext = () => {
	const ctx = useContext(ProfileContext);
	if (!ctx) {
		throw new Error("useProfileContext must be used within an ProfileContextProvider");
	}
	return ctx;
};
