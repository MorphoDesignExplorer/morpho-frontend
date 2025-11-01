import { c as create_ssr_component, b as add_attribute, e as each, v as validate_component, d as escape, a as subscribe } from "../../../../../../chunks/ssr.js";
import { w as writable } from "../../../../../../chunks/index.js";
import { Parser, HtmlRenderer } from "commonmark";
import { P as ProseMirror } from "../../../../../../chunks/ProseMirror.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../../../chunks/state.svelte.js";
import { M as Modal } from "../../../../../../chunks/Modal.js";
const ProjectForm = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { project } = $$props;
  let { form } = $$props;
  const parser = new Parser();
  const renderer = new HtmlRenderer();
  if ($$props.project === void 0 && $$bindings.project && project !== void 0) $$bindings.project(project);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0) $$bindings.form(form);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      console.log(renderer.render(parser.parse(form.form.description)));
    }
    $$rendered = `<div class="flex items-center gap-2 border-l-4 border-gray-500 bg-gray-100 p-2 text-sm"><span class="w-1/4 self-start p-1 font-bold text-black flex flex-col text-xs" data-svelte-h="svelte-1dg6e0o"><span class="text-sm">Project Name</span> <span class="text-gray-500 font-normal">Display name of the project.</span></span> <input type="text" class="w-full bg-gray-50 p-1"${add_attribute("value", form.form.human_name, 0)}></div> <div class="flex items-center gap-2 border-l-4 border-gray-500 bg-gray-100 p-2 text-sm"><span class="w-1/4 self-start p-1 font-bold text-black flex flex-col text-xs" data-svelte-h="svelte-1onyp7u"><span class="text-sm">Captions</span> <span class="text-gray-500 font-normal">Set the captions to be displayed under a solution.</span></span> <div class="flex w-full flex-col gap-1">${each(form.form.captions, (caption, index) => {
      return `<span class="flex gap-1"><select class="w-full bg-gray-50 p-1" placeholder="Attribute"><option value="scoped_id" data-svelte-h="svelte-pqcjqe">scoped_id</option>${each(project.variable_metadata, (field) => {
        return `<option${add_attribute("value", field.field_name, 0)}>${escape(field.field_name)}</option>`;
      })}${each(project.output_metadata, (field) => {
        return `<option${add_attribute("value", field.field_name, 0)}>${escape(field.field_name)}</option>`;
      })}</select> <input type="text" class="w-full bg-gray-50 p-1" placeholder="Display Name"${add_attribute("value", caption.display_name, 0)}> <button type="button" class="bg-gray-200 w-fit px-3" data-svelte-h="svelte-salmax">-</button> </span>`;
    })} <button type="button" class="bg-gray-200 w-fit px-3" data-svelte-h="svelte-1d2wwfx">+</button></div></div> <div class="flex items-center gap-2 border-l-4 border-gray-500 bg-gray-100 p-2 text-sm"><span class="w-1/4 self-start p-1 font-bold text-black flex flex-col text-xs" data-svelte-h="svelte-1m3t2f1"><span class="text-sm">Variable Metadata</span> <span class="text-gray-500 font-normal">Set the measurement unit of each input parameter <br>(or leave it
            blank if it&#39;s unitless)</span></span> <div class="flex w-full flex-col gap-1">${each(form.form.vmetadata, (meta) => {
      return `<span class="flex items-center gap-1"><span class="w-full">${escape(meta.field_name)}</span> <input type="text" class="w-full bg-gray-50 p-1" placeholder="Unit"${add_attribute("value", meta.field_unit, 0)}> </span>`;
    })}</div></div> <div class="flex items-center gap-2 border-l-4 border-gray-500 bg-gray-100 p-2 text-sm"><span class="w-1/4 self-start p-1 font-bold text-black flex flex-col text-xs" data-svelte-h="svelte-11k0dwz"><span class="text-sm">Output Metadata</span> <span class="text-gray-500 font-normal">Set the measurement unit of each output parameter <br>(or leave
            it blank if it&#39;s unitless).</span></span> <div class="flex w-full flex-col gap-1">${each(form.form.ometadata, (meta) => {
      return `<span class="flex items-center gap-1"><span class="w-full">${escape(meta.field_name)}</span> <input type="text" class="w-full bg-gray-50 p-1" placeholder="Unit"${add_attribute("value", meta.field_unit, 0)}> </span>`;
    })}</div></div> <div class="flex items-center gap-2 border-l-4 border-gray-500 bg-gray-100 p-2 text-sm"><span class="w-1/4 self-start p-1 font-bold text-black flex flex-col text-xs" data-svelte-h="svelte-4ptkiy"><span class="text-sm">Asset Metadata</span> <span class="text-gray-500 font-normal">Set the description of each asset.</span></span> <div class="flex w-full flex-col gap-1">${each(form.form.ametadata, (asset) => {
      return `<span class="flex items-center gap-1"><span class="w-full">${escape(asset.tag)}</span> <input type="text" class="w-full bg-gray-50 p-1" placeholder="Description"${add_attribute("value", asset.description, 0)}> </span>`;
    })}</div></div> <div class="flex flex-col items-center gap-2 border-l-4 border-gray-500 bg-gray-100 p-2 text-sm mr-[-40%] mb-20"><span class="w-1/4 self-start p-1 font-bold text-black flex flex-col text-xs" data-svelte-h="svelte-1umraa2"><span class="text-sm">Description</span> <span class="text-gray-500 font-normal">Edit the content on the about page.</span></span> <div class="flex w-full">${validate_component(ProseMirror, "ProseMirror").$$render(
      $$result,
      { text: form.form.description },
      {
        text: ($$value) => {
          form.form.description = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> </div>`;
  } while (!$$settled);
  return $$rendered;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $formData, $$unsubscribe_formData;
  let { data } = $$props;
  let { form } = $$props;
  const { project } = data;
  let formData = writable({
    type: "project",
    form: {
      project_name: project.project_name,
      human_name: project.metadata.human_name,
      captions: project.metadata.captions,
      description: project.metadata.description.text,
      vmetadata: project.variable_metadata,
      ometadata: project.output_metadata,
      ametadata: project.assets
    }
  });
  $$unsubscribe_formData = subscribe(formData, (value) => $formData = value);
  let formElement;
  let modal;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0) $$bindings.form(form);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Modal, "Modal").$$render(
      $$result,
      { this: modal },
      {
        this: ($$value) => {
          modal = $$value;
          $$settled = false;
        }
      },
      {}
    )} <form class="flex min-h-full w-1/2 flex-col gap-3 pt-10" action="?/update" method="POST"${add_attribute("this", formElement, 0)}><h1 class="text-3xl font-extrabold"><span class="text-blue-900" data-svelte-h="svelte-qs95ec">Admin</span> &gt; Edit
        <span class="span underline decoration-dotted">${escape($formData.form.project_name)}</span></h1> <hr class="border-2 border-blue-500"> <div class="flex gap-2"><button class="self-start bg-green-700 font-bold text-white text-sm px-3 py-1" type="submit" data-svelte-h="svelte-f5epia">Save</button> <button class="self-start bg-red-700 font-bold text-white text-sm px-3 py-1" type="button" data-svelte-h="svelte-9xjeub">Delete</button></div> ${form && form.code ? `<span class="border-l-red-800 border-l-[6px] bg-red-200 w-1/2 p-2">${escape(form.message)}</span>` : `${form ? `<span class="border-l-green-800 border-l-[6px] bg-green-200 w-1/2 p-2">${escape(form.message)}</span>` : ``}`} ${validate_component(ProjectForm, "ProjectForm").$$render($$result, { form: $formData, project }, {}, {})}</form>`;
  } while (!$$settled);
  $$unsubscribe_formData();
  return $$rendered;
});
export {
  Page as default
};
