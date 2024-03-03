import NonUserNav from "./NonUserNav";
import UserNav from "./UserNav";
import { useAuthContext } from "../hooks/useAuthContext";
import cx from "classnames";

function Nav() {
	const { state } = useAuthContext();

	return (
		<div className={cx("px-4 border-b ", { "border-border-dark": !state.user, "border-border-light": state.user, "bg-white": state.user, "bg-yellow": !state.user })}>
			<div className="mx-auto max-w-max">
				{!state.user && <NonUserNav />}
				{state.user && <UserNav />}
			</div>
		</div>
	);
}

export default Nav;
