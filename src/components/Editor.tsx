import EditorJS from "@editorjs/editorjs";
import { useEffect, useRef } from "react";
import { EDITOR_JS_TOOLS } from "../utils/editorTools";

const DEFAULT_INITIAL_DATA = {
	time: new Date().getTime(),
	blocks: [
		{
			type: "header",
			data: {
				text: "This is my awesome editor!",
				level: 1,
			},
		},
	],
};

// todo handle props
// function Editor({ onInitialize, blocks = defaultBlocks, readOnly = false }: { onInitialize?: (editor: any) => void; blocks?: any[]; readOnly?: boolean }) {
function Editor() {
	const ejInstance = useRef();

	const initEditor = () => {
		const editor = new EditorJS({
			holder: "editorjs",
			onReady: () => {
				ejInstance.current = editor;
			},
			autofocus: true,
			tools: EDITOR_JS_TOOLS,
			data: DEFAULT_INITIAL_DATA,
			onChange: async () => {
				const content = await editor.saver.save();

				console.log(content);
			},
		});
	};
	useEffect(() => {
		initEditor();

		if (ejInstance.current === null) initEditor();

		return () => {
			// ejInstance?.current?.destroy();
			// ejInstance?.current = null;
		};
	}, [ejInstance]);
	return <div id="editorjs" ref={ejInstance}></div>;
}
export default Editor;
