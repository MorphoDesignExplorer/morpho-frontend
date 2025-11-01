import { s as setContext, k as getContext } from "./ssr.js";
function get_filter_predicates() {
  return getContext("filter_predicates");
}
function set_filter_predicates(store) {
  setContext("filter_predicates", store);
}
function get_display_options() {
  return getContext("display_options");
}
function set_display_options(store) {
  setContext("display_options", store);
}
export {
  set_filter_predicates as a,
  get_filter_predicates as b,
  get_display_options as g,
  set_display_options as s
};
