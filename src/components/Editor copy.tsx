import { createReactEditorJS } from "react-editor-js";
import { EDITOR_JS_TOOLS } from "../utils/editorTools";

const defaultBlocks = [
	{
		id: "12iM3lqzcm",
		type: "paragraph",
		data: { text: "" },
	},
];

// todo: handle focus on each new block made by enter key
function Editor({ onInitialize, blocks = defaultBlocks, readOnly = false }: { onInitialize?: (editor: any) => void; blocks?: any[]; readOnly?: boolean }) {
	const ReactEditor = createReactEditorJS();
	return <ReactEditor tools={EDITOR_JS_TOOLS} readOnly={readOnly} onInitialize={onInitialize} defaultValue={{ blocks }} placeholder="Your story goes here" />;
}
export default Editor;
