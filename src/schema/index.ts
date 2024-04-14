import * as yup from "yup";

// const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/; // for production
const passwordRegex = /.*/; // for testing
const usernameRegex = /^[0-9A-Za-z]{4,16}$/g;
export const signupSchema = yup.object().shape({
	email: yup.string().email("Please enter a valid email").required("Email is required!"),
	username: yup
		.string()
		.min(4)
		.matches(usernameRegex, { message: "Username shouldn't contain special characters or spaces<br/>and must be between 4 and 16 characters" })
		.required("Username is required!"),
	password: yup
		.string()
		.min(6)
		.matches(passwordRegex, { message: "Password must be at least 6 chars long and contain at least one number, one lowercase and one uppercase letter" })
		.required("Password is required!"),
	confirmPassword: yup
		.string()
		// @ts-expect-error -- handle null type later
		.oneOf([yup.ref("password"), null], "Password must match!")
		.required("Password confirmation is required!"),
});

// todo add schema for login
// todo add schemas for settings
