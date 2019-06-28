"use strict";
/*
 * Audicord Bot
 * Author: Mateus Araújo - 2019, source-code projects as credited
 * https://github.com/arj-mat
 * Utilities and snippets
*/
Object.defineProperty(exports, "__esModule", { value: true });
function formatString(str, args) {
    return str.replace(/\%s/g, () => {
        return args.length > 0 ? String(args.shift()) : '%s';
    });
}
exports.formatString = formatString;
function capitalizeStr(str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1).toLowerCase();
}
exports.capitalizeStr = capitalizeStr;
exports.SECOND = 1000;
exports.MINUTE = exports.SECOND * 60;
exports.HOUR = exports.MINUTE * 60;
exports.DAY = exports.HOUR * 24;
//# sourceMappingURL=utils.js.map