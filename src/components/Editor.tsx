import EditorJS from "@editorjs/editorjs";
import { useEffect, useRef } from "react";
import { EDITOR_JS_TOOLS } from "../utils/editorTools";

function Editor({ onReady, blocks = [], readOnly = false }: { onReady?: (editor: any) => void; blocks?: any; readOnly?: boolean }) {
	const ejInstance = useRef<HTMLElement | null>(null);

	const initEditor = () => {
		const editor = new EditorJS({
			holder: "editorjs",
			placeholder: "Let's write an awesome story!",
			onReady: () => {
				// @ts-expect-error
				ejInstance.current = editor;
				if (onReady) onReady(editor);
			},
			readOnly,
			// autofocus: true,
			tools: EDITOR_JS_TOOLS,
			data: { time: new Date().getTime(), blocks },
			// onChange: async () => {
			// 	if (readOnly) return;
			// 	const content = await editor.saver.save();
			// 	console.log(content);
			// },
		});
	};
	useEffect(() => {
		if (ejInstance.current === null) initEditor();
		return () => {
			// @ts-expect-error
			ejInstance?.current?.destroy();
			ejInstance.current = null;
		};
	}, []);
	return <div id="editorjs"></div>;
}
export default Editor;
