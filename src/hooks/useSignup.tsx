import { LOGIN } from "../utils/types";
import { useAuthContext } from "./useAuthContext";
import { useState } from "react";

export const useSignup = () => {
	const [error, setError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { dispatch } = useAuthContext();

	const signup = async (email, password) => {
		setIsLoading(true);
		setError(false);

		const response = await fetch("/api/user/signup", { method: "POST", body: JSON.stringify({ email, password }), headers: { "Content-Type": "application/json" } });
		const json = await response.json();
		if (!response.ok || json.error) {
			setError(json.message); // response from backend like so e.g.: { error: true, message: "Invalid credentials" }
			setIsLoading(false);
			return;
		}

		// save to local storage -- for displaying essential stuff like user avatar, etc
		localStorage.setItem("user", JSON.stringify(json.data.user));

		dispatch({ type: LOGIN, payload: json.data.user });

		setIsLoading(false);
	};

	return { signup, error, isLoading };
};
