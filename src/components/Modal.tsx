import { forwardRef } from "react";
import cx from "classnames";

const Modal = forwardRef(function ({ hideModal, title, children, submit }: { submit: (dialog: any) => void; hideModal: (dialog: any) => void; title: string; children: any }, ref: any) {
	const hide = () => hideModal(ref);
	const save = () => submit(ref);

	const isOutside = (event: any) => {
		const rect = event.target.getBoundingClientRect();
		return rect.left > event.clientX || rect.right < event.clientX || rect.top > event.clientY || rect.bottom < event.clientY;
	};

	const clickHandler = (event: any) => {
		if (isOutside(event)) ref.current.close();
	};

	return (
		<dialog ref={ref} className="p-6 rounded max-w-[40rem] bg-white shadow-search w-full md:w-[40rem]" onClick={clickHandler}>
			<header className="grid grid-cols-[1fr_4rem] mb-4 items-center">
				<h1 className="text-xl font-medium text-text-dark">{title}</h1>
				<button type="button" className="relative w-full h-full py-6" onClick={hide}>
					<span className="pointer-events-none w-[0.125em] bg-text-light h-[1.25em] rotate-45 absolute top-50 translate-y-[-50%] left-0 right-0 block mx-auto"></span>
					<span className="pointer-events-none w-[0.125em] bg-text-light h-[1.25em] -rotate-45 absolute top-50 translate-y-[-50%] left-0 right-0 block mx-auto"></span>
				</button>
			</header>
			<section className="pb-8">{children}</section>
			<div className="flex justify-between">
				<button onClick={hide} className={cx("flex px-4 py-2 text-sm transition-all rounded-full border text-green border-green", {})} type="button">
					Cancel
				</button>

				<button onClick={save} className={cx("flex px-4 bg-green text-white py-2 text-sm transition-all rounded-full", {})} type="button">
					Save
				</button>
			</div>
		</dialog>
	);
});

export default Modal;
