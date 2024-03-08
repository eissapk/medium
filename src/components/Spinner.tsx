const Spinner = ({
	isArticle = false,
	isAvatar = false,
	isLine = false,
	className,
	children,
}: {
	isArticle?: boolean;
	isAvatar?: boolean;
	isLine?: boolean;
	className?: string;
	children?: React.ReactNode;
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
