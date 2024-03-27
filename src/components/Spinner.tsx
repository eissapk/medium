import cx from "classnames";
const Spinner = ({
	isArticle = false,
	isAvatar = false,
	isLine = false,
	isUser = false,
	className = "",
	children,
	size = "lg",
}: {
	isArticle?: boolean;
	isUser?: boolean;
	isAvatar?: boolean;
	isLine?: boolean;
	className?: string;
	children?: React.ReactNode;
	size?: "sm" | "lg";
}) => {
	if (isAvatar) {
		return (
			<>
				<div className={`w-[70%] rounded-md ${className}`}>
					<div className="flex flex-col space-x-4 animate-pulse">
						<div className="w-20 h-20 mb-4 rounded-full bg-slate-200"></div>
						<div className="flex-1 py-1 !m-0 space-y-6">
							<div className="h-2 rounded bg-slate-200"></div>
							<div className="space-y-3">
								<div className="grid grid-cols-3 gap-4">
									<div className="h-2 col-span-2 rounded bg-slate-200"></div>
									<div className="h-2 col-span-1 rounded bg-slate-200"></div>
								</div>
								<div className="h-2 rounded bg-slate-200"></div>
							</div>
						</div>
					</div>
				</div>
				{children}
			</>
		);
	}
	if (isUser) {
		return (
			<>
				<div className={cx("w-full rounded-md", { [className]: className })}>
					<div className="flex items-center space-x-4 animate-pulse">
						<div className={cx("w-12 h-12 rounded-full me-4 bg-slate-200", { "w-6 h-6": size === "sm" })}></div>
						<div className="flex-1 py-1 !m-0 space-y-6">
							<div className="space-y-3">
								<div className="grid grid-cols-3 gap-4">
									<div className={cx("h-2 col-span-2 rounded bg-slate-200", { "h-1": size === "sm" })}></div>
									<div className={cx("h-2 col-span-1 rounded bg-slate-200", { "h-1": size === "sm" })}></div>
								</div>
								<div className={cx("h-2 rounded bg-slate-200", { "h-1": size === "sm" })}></div>
							</div>
						</div>
					</div>
				</div>
				{children}
			</>
		);
	}
	if (isArticle) {
		return (
			<>
				<div className={`w-full rounded-md ${className}`}>
					<div className="flex flex-row-reverse items-center space-x-4 animate-pulse">
						<div className="w-20 h-20 rounded ms-4 bg-slate-200"></div>
						<div className="flex-1 py-1 !m-0 space-y-6">
							<div className="h-2 rounded bg-slate-200"></div>
							<div className="space-y-3">
								<div className="grid grid-cols-3 gap-4">
									<div className="h-2 col-span-2 rounded bg-slate-200"></div>
									<div className="h-2 col-span-1 rounded bg-slate-200"></div>
								</div>
								<div className="h-2 rounded bg-slate-200"></div>
							</div>
						</div>
					</div>
				</div>
				{children}
			</>
		);
	}
	if (isLine) {
		return (
			<>
				<div className={`w-full flex items-center rounded-md ${className}`}>
					<div className="flex w-full space-x-4 animate-pulse">
						<div className="flex-1 py-1 space-y-6">
							<div className="space-y-3">
								<div className="grid grid-cols-3 gap-4">
									<div className="h-2 col-span-2 rounded bg-slate-200"></div>
									<div className="h-2 col-span-1 rounded bg-slate-200"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{children}
			</>
		);
	}
	return (
		<>
			<div className={`w-full rounded-md ${className}`}>
				<div className="flex space-x-4 animate-pulse">
					<div className="flex-1 py-1 space-y-6">
						<div className="h-2 rounded bg-slate-200"></div>
						<div className="space-y-3">
							<div className="grid grid-cols-3 gap-4">
								<div className="h-2 col-span-2 rounded bg-slate-200"></div>
								<div className="h-2 col-span-1 rounded bg-slate-200"></div>
							</div>
							<div className="h-2 rounded bg-slate-200"></div>
						</div>
					</div>
				</div>
			</div>
			{children}
		</>
	);
};
export default Spinner;
