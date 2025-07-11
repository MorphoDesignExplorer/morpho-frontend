import {wrapItem, blockTypeItem, Dropdown, DropdownSubmenu, joinUpItem, liftItem,
       selectParentNodeItem, undoItem, redoItem, icons, MenuItem, type MenuElement, type MenuItemSpec} from "prosemirror-menu"
import {NodeSelection, EditorState, type Command} from "prosemirror-state"
import {Schema, NodeType, MarkType} from "prosemirror-model"
import {toggleMark} from "prosemirror-commands"
import {wrapInList} from "prosemirror-schema-list"
import {type Attrs} from "prosemirror-model"

const prefix = "ProseMirror-prompt"

export function openPrompt(options: {
  title: string,
  fields: {[name: string]: Field},
  callback: (attrs: Attrs) => void
}) {
  let wrapper = document.body.appendChild(document.createElement("div"))
  wrapper.className = prefix

  let mouseOutside = (e: MouseEvent) => { if (!wrapper.contains(e.target as HTMLElement)) close() }
  setTimeout(() => window.addEventListener("mousedown", mouseOutside), 50)
  let close = () => {
    window.removeEventListener("mousedown", mouseOutside)
    if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper)
  }

  let domFields: HTMLElement[] = []
  for (let name in options.fields) domFields.push(options.fields[name].render())

  let submitButton = document.createElement("button")
  submitButton.type = "submit"
  submitButton.className = prefix + "-submit"
  submitButton.textContent = "OK"
  let cancelButton = document.createElement("button")
  cancelButton.type = "button"
  cancelButton.className = prefix + "-cancel"
  cancelButton.textContent = "Cancel"
  cancelButton.addEventListener("click", close)

  let form = wrapper.appendChild(document.createElement("form"))
  form.className = "flex flex-col gap-2"
  if (options.title) form.appendChild(document.createElement("h5")).textContent = options.title
  domFields.forEach(field => {
    form.appendChild(document.createElement("div")).appendChild(field)
  })
  let buttons = form.appendChild(document.createElement("div"))
  buttons.className = prefix + "-buttons"
  buttons.appendChild(submitButton)
  buttons.appendChild(document.createTextNode(" "))
  buttons.appendChild(cancelButton)

  let box = wrapper.getBoundingClientRect()
  wrapper.style.top = ((window.innerHeight - box.height) / 2) + "px"
  wrapper.style.left = ((window.innerWidth - box.width) / 2) + "px"

  let submit = () => {
    let params = getValues(options.fields, domFields)
    if (params) {
      close()
      options.callback(params)
    }
  }

  form.addEventListener("submit", e => {
    e.preventDefault()
    submit()
  })

  form.addEventListener("keydown", e => {
    if (e.keyCode == 27) {
      e.preventDefault()
      close()
    } else if (e.keyCode == 13 && !(e.ctrlKey || e.metaKey || e.shiftKey)) {
      e.preventDefault()
      submit()
    } else if (e.keyCode == 9) {
      window.setTimeout(() => {
        if (!wrapper.contains(document.activeElement)) close()
      }, 500)
    }
  })

  let input = form.elements[0] as HTMLElement
  if (input) input.focus()
}

function getValues(fields: {[name: string]: Field}, domFields: readonly HTMLElement[]) {
  let result = Object.create(null), i = 0
  for (let name in fields) {
    let field = fields[name], dom = domFields[i++]
    let value = field.read(dom), bad = field.validate(value)
    if (bad) {
      reportInvalid(dom, bad)
      return null
    }
    if ((dom as HTMLInputElement).files) {
        result[name] = (dom as HTMLInputElement).files
        continue
    }
    result[name] = field.clean(value)
  }
  return result
}

function reportInvalid(dom: HTMLElement, message: string) {
  // FIXME this is awful and needs a lot more work
  let parent = dom.parentNode!
  let msg = parent.appendChild(document.createElement("div"))
  msg.style.left = (dom.offsetLeft + dom.offsetWidth + 2) + "px"
  msg.style.top = (dom.offsetTop - 5) + "px"
  msg.className = "ProseMirror-invalid"
  msg.textContent = message
  setTimeout(() => parent.removeChild(msg), 1500)
}

/// The type of field that `openPrompt` expects to be passed to it.
export abstract class Field {
  /// Create a field with the given options. Options support by all
  /// field types are:
  constructor(
    /// @internal
    readonly options: {
      /// The starting value for the field.
      value?: any

      /// The label for the field.
      label: string

      /// Whether the field is required.
      required?: boolean

      /// A function to validate the given value. Should return an
      /// error message if it is not valid.
      validate?: (value: any) => string | null

      /// A cleanup function for field values.
      clean?: (value: any) => any
    }
  ) {}

  /// Render the field to the DOM. Should be implemented by all subclasses.
  abstract render(): HTMLElement

  /// Read the field's value from its DOM node.
  read(dom: HTMLElement) { return (dom as any).value }

  /// A field-type-specific validation function.
  validateType(value: any): string | null { return null }

  /// @internal
  validate(value: any): string | null {
    if (!value && this.options.required)
      return "Required field"
    return this.validateType(value) || (this.options.validate ? this.options.validate(value) : null)
  }

  clean(value: any): any {
    return this.options.clean ? this.options.clean(value) : value
  }
}

/// A field class for single-line text fields.
class TextField extends Field {
  render() {
    let input = document.createElement("input")
    input.type = "text"
    input.placeholder = this.options.label
    input.value = this.options.value || ""
    input.autocomplete = "off"
    return input
  }
}

class FileField extends Field {
    render() {
        let input = document.createElement("input")
        input.type = "file"
        return input
    }
}

class SubmitField extends Field {
    render() {
        let input = document.createElement("input")
        input.type = "submit"
        input.className = "bg-gray border border-gray-200 text-black font-bold px-2 py-1"
        return input
    }
}

/// A field class for dropdown fields based on a plain `<select>`
/// tag. Expects an option `options`, which should be an array of
/// `{value: string, label: string}` objects, or a function taking a
/// `ProseMirror` instance and returning such an array.
export class SelectField extends Field {
  render() {
    let select = document.createElement("select")
    ;((this.options as any).options as {value: string, label: string}[]).forEach(o => {
      let opt = select.appendChild(document.createElement("option"))
      opt.value = o.value
      opt.selected = o.value == this.options.value
      opt.label = o.label
    })
    return select
  }
}


// Helpers to create specific types of items

function canInsert(state: EditorState, nodeType: NodeType) {
  let $from = state.selection.$from
  for (let d = $from.depth; d >= 0; d--) {
    let index = $from.index(d)
    if ($from.node(d).canReplaceWith(index, index, nodeType)) return true
  }
  return false
}

function insertImageItem(nodeType: NodeType, schema: Schema) {
  return new MenuItem({
    title: "Insert image",
    label: "Image",
    enable(state) { return canInsert(state, nodeType) },
    run(state, _, view) {
      let {from, to} = state.selection, attrs = null
      if (state.selection instanceof NodeSelection && state.selection.node.type == nodeType)
        attrs = state.selection.node.attrs
      openPrompt({
        title: "Insert image",
        fields: {
            file: new FileField({label: "File", required: true}),
            submit: new SubmitField({label: "Upload", required: false})
        },
        callback(attrs) {
            const form = new FormData();
            form.append("image", (attrs as {file: FileList}).file[0])
            fetch("/auth/admin/images/", {
                method: "POST",
                body: form
            }).then(
                async response => {
                    if (response.ok) {
                        let data = await response.json() as {imgurl: string}
                        console.log(data)
                        view.dispatch(view.state.tr.replaceSelectionWith(schema.node("image", {src: `https://morpho-images.s3.us-east-1.amazonaws.com/${data.imgurl}`})))
                    } else {
                        console.log(await response.json())
                    }
                }
            )
            // view.dispatch(view.state.tr.replaceSelectionWith(nodeType.createAndFill(attrs)!))
            // view.focus()
        }
      })
    }
  })
}

function cmdItem(cmd: Command, options: Partial<MenuItemSpec>) {
  let passedOptions: MenuItemSpec = {
    label: options.title as string | undefined,
    run: cmd
  }
  for (let prop in options) (passedOptions as any)[prop] = (options as any)[prop]
  if (!options.enable && !options.select)
    passedOptions[options.enable ? "enable" : "select"] = state => cmd(state)

  return new MenuItem(passedOptions)
}

function markActive(state: EditorState, type: MarkType) {
  let {from, $from, to, empty} = state.selection
  if (empty) return !!type.isInSet(state.storedMarks || $from.marks())
  else return state.doc.rangeHasMark(from, to, type)
}

function markItem(markType: MarkType, options: Partial<MenuItemSpec>) {
  let passedOptions: Partial<MenuItemSpec> = {
    active(state) { return markActive(state, markType) }
  }
  for (let prop in options) (passedOptions as any)[prop] = (options as any)[prop]
  return cmdItem(toggleMark(markType), passedOptions)
}

function linkItem(markType: MarkType) {
  return new MenuItem({
    title: "Add or remove link",
    icon: icons.link,
    active(state) { return markActive(state, markType) },
    enable(state) { return !state.selection.empty },
    run(state, dispatch, view) {
      if (markActive(state, markType)) {
        toggleMark(markType)(state, dispatch)
        return true
      }
      openPrompt({
        title: "Create a link",
        fields: {
          href: new TextField({
            label: "Link target",
            required: true
          }),
          title: new TextField({label: "Title"}),
          submit: new SubmitField({label: "Submit"})
        },
        callback(attrs) {
          toggleMark(markType, attrs)(view.state, view.dispatch)
          view.focus()
        }
      })
    }
  })
}

function wrapListItem(nodeType: NodeType, options: Partial<MenuItemSpec>) {
  return cmdItem(wrapInList(nodeType, (options as any).attrs), options)
}

type MenuItemResult = {
  /// A menu item to toggle the [strong mark](#schema-basic.StrongMark).
  toggleStrong?: MenuItem

  /// A menu item to toggle the [emphasis mark](#schema-basic.EmMark).
  toggleEm?: MenuItem

  /// A menu item to toggle the [code font mark](#schema-basic.CodeMark).
  toggleCode?: MenuItem

  /// A menu item to toggle the [link mark](#schema-basic.LinkMark).
  toggleLink?: MenuItem

  /// A menu item to insert an [image](#schema-basic.Image).
  insertImage?: MenuItem

  /// A menu item to wrap the selection in a [bullet list](#schema-list.BulletList).
  wrapBulletList?: MenuItem

  /// A menu item to wrap the selection in an [ordered list](#schema-list.OrderedList).
  wrapOrderedList?: MenuItem

  /// A menu item to wrap the selection in a [block quote](#schema-basic.BlockQuote).
  wrapBlockQuote?: MenuItem

  /// A menu item to set the current textblock to be a normal
  /// [paragraph](#schema-basic.Paragraph).
  makeParagraph?: MenuItem

  /// A menu item to set the current textblock to be a
  /// [code block](#schema-basic.CodeBlock).
  makeCodeBlock?: MenuItem

  /// Menu items to set the current textblock to be a
  /// [heading](#schema-basic.Heading) of level _N_.
  makeHead1?: MenuItem
  makeHead2?: MenuItem
  makeHead3?: MenuItem
  makeHead4?: MenuItem
  makeHead5?: MenuItem
  makeHead6?: MenuItem

  /// A menu item to insert a horizontal rule.
  insertHorizontalRule?: MenuItem

  /// A dropdown containing the `insertImage` and
  /// `insertHorizontalRule` items.
  insertMenu: Dropdown

  /// A dropdown containing the items for making the current
  /// textblock a paragraph, code block, or heading.
  typeMenu: Dropdown

  /// Array of block-related menu items.
  blockMenu: MenuElement[][]

  /// Inline-markup related menu items.
  inlineMenu: MenuElement[][]

  /// An array of arrays of menu elements for use as the full menu
  /// for, for example the [menu
  /// bar](https://github.com/prosemirror/prosemirror-menu#user-content-menubar).
  fullMenu: MenuElement[][]
}

/// Given a schema, look for default mark and node types in it and
/// return an object with relevant menu items relating to those marks.
export function buildMenuItems(schema: Schema): MenuItemResult {
  let r: MenuItemResult = {} as any
  let mark: MarkType | undefined
  if (mark = schema.marks.strong)
    r.toggleStrong = markItem(mark, {title: "Toggle strong style", icon: icons.strong})
  if (mark = schema.marks.em)
    r.toggleEm = markItem(mark, {title: "Toggle emphasis", icon: icons.em})
  if (mark = schema.marks.code)
    r.toggleCode = markItem(mark, {title: "Toggle code font", icon: icons.code})
  if (mark = schema.marks.link)
    r.toggleLink = linkItem(mark)

  let node: NodeType | undefined
  if (node = schema.nodes.image)
    r.insertImage = insertImageItem(node, schema)
  if (node = schema.nodes.bullet_list)
    r.wrapBulletList = wrapListItem(node, {
      title: "Wrap in bullet list",
      icon: icons.bulletList
    })
  if (node = schema.nodes.ordered_list)
    r.wrapOrderedList = wrapListItem(node, {
      title: "Wrap in ordered list",
      icon: icons.orderedList
    })
  if (node = schema.nodes.blockquote)
    r.wrapBlockQuote = wrapItem(node, {
      title: "Wrap in block quote",
      icon: icons.blockquote
    })
  if (node = schema.nodes.paragraph)
    r.makeParagraph = blockTypeItem(node, {
      title: "Change to paragraph",
      label: "Plain"
    })
  if (node = schema.nodes.code_block)
    r.makeCodeBlock = blockTypeItem(node, {
      title: "Change to code block",
      label: "Code"
    })
  if (node = schema.nodes.heading)
    for (let i = 1; i <= 10; i++)
      (r as any)["makeHead" + i] = blockTypeItem(node, {
        title: "Change to heading " + i,
        label: "Level " + i,
        attrs: {level: i}
      })
  if (node = schema.nodes.horizontal_rule) {
    let hr = node
    r.insertHorizontalRule = new MenuItem({
      title: "Insert horizontal rule",
      label: "Horizontal rule",
      enable(state) { return canInsert(state, hr) },
      run(state, dispatch) { dispatch(state.tr.replaceSelectionWith(hr.create())) }
    })
  }

  let cut = <T>(arr: T[]) => arr.filter(x => x) as NonNullable<T>[]
  r.insertMenu = new Dropdown(cut([r.insertImage, r.insertHorizontalRule]), {label: "Insert"})
  r.typeMenu = new Dropdown(cut([r.makeParagraph, r.makeCodeBlock, r.makeHead1 && new DropdownSubmenu(cut([
    r.makeHead1, r.makeHead2, r.makeHead3, r.makeHead4, r.makeHead5, r.makeHead6
  ]), {label: "Heading"})]), {label: "Type..."})

  r.inlineMenu = [cut([r.toggleStrong, r.toggleEm, r.toggleCode, r.toggleLink])]
  r.blockMenu = [cut([r.wrapBulletList, r.wrapOrderedList, r.wrapBlockQuote, joinUpItem,
                      liftItem, selectParentNodeItem])]
  r.fullMenu = r.inlineMenu.concat([[r.insertMenu, r.typeMenu]], [[undoItem, redoItem]], r.blockMenu)

  return r
}
