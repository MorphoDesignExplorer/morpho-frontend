<script lang="ts">
    import { EditorState } from "prosemirror-state"
    import { EditorView, type DirectEditorProps } from "prosemirror-view"
    import { schema, defaultMarkdownSerializer, defaultMarkdownParser } from "prosemirror-markdown"
    import { exampleSetup } from "prosemirror-example-setup"
    import { buildMenuItems } from "./ProseMirrorMenu"
    import { onMount } from "svelte";

    import "prosemirror-view/style/prosemirror.css";
    import "prosemirror-menu/style/menu.css";
    import "prosemirror-example-setup/style/style.css";
    import "../../material/[slug]/material.sass";

    export let text: string;

    // Mix the nodes from prosemirror-schema-list into the basic schema to
    // create a schema with list support.

    let content: HTMLDivElement;
    let editor: HTMLDivElement;

    class ProseMirrorView {
        view: EditorView;
        constructor(target: HTMLDivElement, props: DirectEditorProps) {
            this.view = new EditorView(target, {
                ...props
            })
        }

        get content() {
            return defaultMarkdownSerializer.serialize(this.view.state.doc)
        }
        focus() { this.view.focus() }
        destroy() { this.view.destroy() }
    }


    let view: ProseMirrorView
    onMount(() => {
        view = new ProseMirrorView(editor, {
            state: EditorState.create({
                doc: defaultMarkdownParser.parse(text),
                plugins: [
                    ...exampleSetup({
                        schema: schema,
                        menuContent: [
                            ...buildMenuItems(schema).fullMenu,
                            []
                        ]
                    }),
                ]
            }),
            dispatchTransaction: transaction => {
                const newState = view.view.state.apply(transaction)
                view.view.updateState(newState)
                text = view.content
            }
        })
        view.view.dom.className = "editable-content"
        view.view.dom.spellcheck = false
    })
</script>

<div bind:this={content} class="hidden"/>
<div bind:this={editor} class="w-full bg-white min-h-content p-2 m-1"/>
