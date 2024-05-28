/** @enum {string} */
const optype = {
    ge: ">=",
    le: "<=",
    gt: ">",
    lt: "<",
    eq: "=",
    ne: "!="
}

/**
 * @param {{lvalue: string, op: optype, rvalue: string | number}[]} predicates
*/
export function predicate_equal(predicates) {
    predicates.pop();
    /**
     * @param {{output_parameters: Object<string, number|string>, parameters: Object<string, number|string>}} model 
     * @returns {boolean}
    */
    return function filter_model_with_predicates(model) {
        return predicates.map(predicate => {
            const rvalue = parseFloat(predicate.rvalue);
            let value_to_check;
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
                    console.log(value_to_check, predicate.op, rvalue, rvalue < value_to_check)
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

/**
 * @param {{id: number | string, parameters: Object<string, string|number>, output_parameters: Object<string, string|number>, files: Object<string, string>[]}} model 
 * @param {string} tag 
*/
export function get_image_src_or_empty(model, tag) {
    const file = model.files.filter(obj => obj.tag == tag)[0];
    if (file !== undefined) 
        return file.file
    else
        return ""
}