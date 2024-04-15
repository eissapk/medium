import { fetchAPI } from "../utils";
import { LOGIN } from "../utils/types";
import { useAuthContext } from "./useAuthContext";
import { useState } from "react";

export const useSignup = () => {
	const [error, setError] = useState<boolean | string>(false);
	const [isLoading, setIsLoading] = useState(false);
	const { dispatch } = useAuthContext();

	const signup = async (email: string, username: string, password: string) => {
		setIsLoading(true);
		setError(false);

		const response = await fetchAPI("/api/user/signup", { method: "POST", body: JSON.stringify({ email, username, password }), headers: { "Content-Type": "application/json" } });
		const json = await response.json();
		if (!response.ok || json.error) {
			setError(json.message); // response from backend like so e.g.: { error: true, message: "Invalid credentials" }
			setIsLoading(false);
			return;
		}

		// no need to save user email or id as it's set by server (httpOnly, cookies)
		dispatch({ type: LOGIN, payload: json.data.user });

		setIsLoading(false);
		setError(false);
	};

	return { signup, error, isLoading };
};
