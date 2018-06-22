/**
 * Declares all globals with a var and assigns the global object. Thus you're able to
 * override globals without changing the global object itself.
 *
 * Returns something like
 * "var console = global.console; var process = global.process; ..."
 *
 * @return {String}
 */
function getImportGlobalsSrc(ignore, newGlobals) {
    var key,
        value,
        src = "",
        globalObj = typeof global === "undefined"? window: global;

    ignore = ignore || [];
    newGlobals = newGlobals || {};
    // global itself can't be overridden because it's the only reference to our real global objects
    ignore.push("global");
    // ignore 'module', 'exports' and 'require' on the global scope, because otherwise our code would
    // shadow the module-internal variables
    // @see https://github.com/jhnns/rewire-webpack/pull/6
    ignore.push("module", "exports", "require");

    var newKeys = Object.keys(newGlobals);
    
    for (key in globalObj) { /* jshint forin: false */
        if (ignore.indexOf(key) !== -1) {
            continue;
        }
        if(newKeys.indexOf(key)) {
            throw new Error("Global '" + key + "' already exists in this module");
        }
        value = globalObj[key];

        // key may be an invalid variable name (e.g. 'a-b')
        try {
          eval("var " + key + ";");
          src += "var " + key + " = global." + key + "; ";
        } catch(e) {}
    }

    for(key in newGlobals) {
        globalObj[key] = newGlobals[key]
    }

    return src;
}

module.exports = getImportGlobalsSrc;
