import type { Model } from "./types";
import type { ManualFilter } from "./context";

/** @enum {string} */
const optype = {
    ge: ">=",
    le: "<=",
    gt: ">",
    lt: "<",
    eq: "=",
    ne: "!="
}

export function predicate_equal(predicates: ManualFilter[]) {
    predicates.pop();
    return function filter_model_with_predicates(model: Model) {
        return predicates.map(predicate => {
            if (predicate.rvalue == "") {
                // if filter is empty, don't filter anything
                return true;
            }

            const rvalue = parseFloat(predicate.rvalue);
            let value_to_check: string | number;
            if (predicate.lvalue in model.parameters) {
                value_to_check = model.parameters[predicate.lvalue];
            } else if (predicate.lvalue in model.output_parameters) {
                value_to_check = model.output_parameters[predicate.lvalue];
            }

            switch (predicate.op) {
                case optype.ge:
                    return value_to_check >= rvalue
                case optype.le:
                    return value_to_check <= rvalue
                case optype.gt:
                    return value_to_check > rvalue
                case optype.lt:
                    return value_to_check < rvalue
                case optype.eq:
                    return value_to_check == rvalue
                case optype.ne:
                    return value_to_check != rvalue
            }

            return true;
        }).reduce((prev, curr) => prev && curr, true);
    }
}

export function get_image_src_or_empty(model: Model, tag: string) {
    const file = model.files.filter(obj => obj.tag == tag)[0];
    if (file !== undefined) 
        return file.file
    else
        return ""
}