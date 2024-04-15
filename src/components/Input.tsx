import { useField } from "formik";

function Input({
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
	type: string;
	placeholder?: string;
}) {
	const [field, meta] = useField(props);

	const changeHandler = (e: any) => {
		if (onChangeHook) onChangeHook(e.target.value);
		field.onChange(e);
	};
	return (
		<>
			{label !== "" && <label className={labelStyle}>{label}</label>}
			<input {...props} name={field.name} value={field.value} onChange={changeHandler} onBlur={field.onBlur} className={meta.error && meta.touched ? `${className} border border-red` : className} />
			{meta.touched && meta.error && <p className="text-start text-xs my-2 text-red" dangerouslySetInnerHTML={{ __html: meta.error }}></p>}
		</>
	);
}

export default Input;
