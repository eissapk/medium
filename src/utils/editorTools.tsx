// @ts-expect-error
import Embed from "@editorjs/embed";
// @ts-expect-error
import Table from "@editorjs/table";
// @ts-expect-error
import List from "@editorjs/list";
// import Warning from "@editorjs/warning";
// @ts-expect-error
import Code from "@editorjs/code";
// @ts-expect-error
import LinkTool from "@editorjs/link";
// @ts-expect-error
import Image from "@editorjs/image";
// @ts-expect-error
import Raw from "@editorjs/raw";
// @ts-expect-error
import Header from "@editorjs/header";
// @ts-expect-error
import Quote from "@editorjs/quote";
// @ts-expect-error
import Marker from "@editorjs/marker";
// @ts-expect-error
import CheckList from "@editorjs/checklist";
// @ts-expect-error
import Delimiter from "@editorjs/delimiter";
// @ts-expect-error
import InlineCode from "@editorjs/inline-code";
// @ts-expect-error
import Underline from "@editorjs/underline";

export const EDITOR_JS_TOOLS = {
	embed: Embed,
	underline: Underline,
	table: Table,
	marker: Marker,
	list: List,
	// warning: Warning,
	code: Code,
	linkTool: LinkTool,
	image: {
		class: Image,
		config: {
			endpoints: {
				byFile: "/api/upload/byfile",
				byUrl: "/api/upload/byurl",
			},
		},
	},
	raw: Raw,
	header: Header,
	quote: Quote,
	checklist: CheckList,
	delimiter: Delimiter,
	inlineCode: InlineCode,
};