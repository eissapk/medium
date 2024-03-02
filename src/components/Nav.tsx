import NonUserNav from "./NonUserNav";
import UserNav from "./UserNav";
import { useAuthContext } from "../hooks/useAuthContext";
import cx from "classnames";

function Nav() {
	const { state } = useAuthContext();

	return (
		<div className={cx("border-b ", { "border-border-dark": !state.user, "border-border-light": state.user, "bg-white": state.user, "bg-yellow": !state.user })}>
			<div className="max-w-5xl mx-auto">
				{!state.user && <NonUserNav />}
				{state.user && <UserNav />}
			</div>
		</div>
	);
}

export default Nav;
