import { useField } from "formik";

function TextArea({
	label = "",
	labelStyle = "",
	className = "",
	onChangeHook,
	...props
}: {
	label?: string;
	labelStyle?: string;
	className?: string;
	onChangeHook?: (value: string) => void;
	autoFocus?: boolean;
	name: string;
	placeholder?: string;
	rows?: number;
}) {
	const [field, meta] = useField(props);

	const changeHandler = (e: any) => {
		if (onChangeHook) onChangeHook(e);
		field.onChange(e);
	};
	return (
		<>
			{label !== "" && <label className={labelStyle}>{label}</label>}
			<textarea
				{...props}
				name={field.name}
				value={field.value}
				onChange={changeHandler}
				onBlur={field.onBlur}
				className={
					meta.error && meta.touched
						? `${className} resize-y outline-none border-b border-b-red`
						: className + " resize-y transition-border border-b outline-none focus:border-b-border-dark border-b-border-light"
				}></textarea>
			{meta.touched && meta.error && <p className="my-2 text-xs text-start text-red" dangerouslySetInnerHTML={{ __html: meta.error }}></p>}
		</>
	);
}

export default TextArea;
