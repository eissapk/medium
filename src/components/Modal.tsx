import { forwardRef } from "react";
import cx from "classnames";
import { Close } from "../assets/icons";

const Modal = forwardRef(function (
	{
		hideModal,
		title,
		children,
		submit,
		errorMessage = null,
		successMessage = null,
	}: { submit?: (dialog: any) => void; hideModal: (dialog: any) => void; title: string; children: any; errorMessage?: string | null; successMessage?: string | null },
	ref: any
) {
	const hide = () => hideModal(ref);
	const save = () => submit && submit(ref);

	const isOutside = (event: any) => {
		const rect = event.target.getBoundingClientRect();
		return rect.left > event.clientX || rect.right < event.clientX || rect.top > event.clientY || rect.bottom < event.clientY;
	};

	const clickHandler = (event: any) => {
		if (isOutside(event)) ref.current.close();
	};

	return (
		<dialog ref={ref} className="p-6 rounded max-w-[40rem] bg-white shadow-search w-full md:w-[40rem]" onClick={clickHandler}>
			<header className="grid grid-cols-[1fr_2rem] mb-4 items-center">
				<h1 className="text-xl font-medium text-text-dark">{title}</h1>
				<button type="button" className="w-full h-full py-6 flex justify-center items-center" onClick={hide}>
					<Close className="w-6 h-6 pointer-events-none" />
				</button>
			</header>
			<section className="pb-8">{children}</section>

			{errorMessage && <div className={"my-4 -mt-4 text-xs text-white inline-block py-1 px-2 rounded-sm bg-red font-medium text-center"}>{errorMessage}</div>}
			{successMessage && <div className={"my-4 -mt-4 text-xs text-white inline-block py-1 px-2 rounded-sm bg-green font-medium text-center"}>{successMessage}</div>}

			<div className="flex justify-between">
				<button onClick={hide} className={cx("flex px-4 py-2 text-sm transition-all rounded-full border text-green border-green", {})} type="button">
					Cancel
				</button>

				<button onClick={save} className={cx("flex px-4 bg-green text-white py-2 text-sm transition-all rounded-full", {})} type="submit" form="modalForm">
					Save
				</button>
			</div>
		</dialog>
	);
});

export default Modal;
