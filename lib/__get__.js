/**
 * This function will be stringified and then injected into every rewired module.
 * Then you can leak private variables by calling myModule.__get__("myPrivateVar");
 *
 * All variables within this function are namespaced in the arguments array because every
 * var declaration could possibly clash with a variable in the module scope.
 *
 * @param {!String} name name of the variable to retrieve
 * @param {boolean} [optional=false] if this variable is optional, if so undefined may be returned
 * @throws {TypeError}
 * @return {*}
 */
function __get__() {
    arguments.varName = arguments[0];
    arguments.optional = arguments[1];
    if (arguments.varName && typeof arguments.varName === "string") {
        try {
            return eval(arguments.varName);
        } catch(e) {
            if(arguments.optional) return undefined;
            throw e;
        }
    } else {
        throw new TypeError("__get__ expects a non-empty string");
    }
}

module.exports = __get__;