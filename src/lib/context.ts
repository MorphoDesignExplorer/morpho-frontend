import type { DisplayOptions } from "$lib/types";
import { getContext, setContext } from "svelte";
import type { Writable } from "svelte/store";

const optype = {
        ge: ">=",
        le: "<=",
        gt: ">",
        lt: "<",
        eq: "=",
        ne: "!="
    }

export type ManualFilterOptype =  ">=" | "<=" | ">" | "<" | "=" | "!=";

export type ManualFilter = {
    lvalue: string,
    op: ManualFilterOptype,
    rvalue: number | string
}

export interface FilterPredicates {
    chart_predicate: number[],
    filter_predicate: ManualFilter[]
}

export function get_filter_predicates(): Writable<FilterPredicates> {
    return getContext("filter_predicates");
}

export function set_filter_predicates(store: Writable<FilterPredicates>) {
    setContext("filter_predicates", store);
}

export function get_display_options(): Writable<DisplayOptions> {
    return getContext("display_options");
}

export function set_display_options(store: Writable<DisplayOptions>) {
    setContext("display_options", store);
}
