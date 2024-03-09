import NonUserNav from "./NonUserNav";
import UserNav from "./UserNav";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLocation } from "react-router-dom";
import cx from "classnames";

function Nav() {
	const { state } = useAuthContext();
	const location = useLocation();
	const classes = {
		"border-border-dark": !state.user && location.pathname === "/",
		"bg-yellow": !state.user && location.pathname === "/",
		"border-border-light": state.user,
		"bg-white": state.user,
	};
	return (
		<div className={cx("px-4 border-b ", classes)}>
			<div className="mx-auto max-w-max">
				{!state.user && <NonUserNav />}
				{state.user && <UserNav />}
			</div>
		</div>
	);
}

export default Nav;
