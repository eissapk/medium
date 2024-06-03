import cx from "classnames";
import { useField } from "formik";

function Input({
	label = "",
	labelStyle = "",
	className = "",
	wrapperClassName = "",
	onChangeHook,
	...props
}: {
	label?: string;
	labelStyle?: string;
	className?: string;
	onChangeHook?: (value: string) => void;
	autoFocus?: boolean;
	name: string;
	type: string;
	placeholder?: string;
	autoComplete?: string;
	min?: number;
	max?: number;
	wrapperClassName?: string;
}) {
	const [field, meta] = useField(props);

	const changeHandler = (e: any) => {
		if (onChangeHook) onChangeHook(e);
		field.onChange(e);
	};

	return (
		<>
			<div className={cx({ [wrapperClassName]: wrapperClassName })}>
				{label !== "" && <label className={labelStyle}>{label}</label>}
				<input
					{...props}
					name={field.name}
					value={field.value}
					onChange={changeHandler}
					onBlur={field.onBlur}
					className={
						meta.error && meta.touched ? `${className} outline-none border-b border-b-red` : className + " transition-border border-b outline-none focus:border-b-border-dark border-b-border-light"
					}
				/>
			</div>
			{meta.touched && meta.error && <p className="my-2 text-xs text-start text-red" dangerouslySetInnerHTML={{ __html: meta.error }}></p>}
		</>
	);
}

export default Input;