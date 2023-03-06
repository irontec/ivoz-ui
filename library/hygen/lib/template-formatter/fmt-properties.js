const getApiDocs = require('../api/get-api-properties')
const tab = "  ";
/**
 *
 * @param {*} url
 * @param {*} args
 * @returns Formatted properties
 */
module.exports = function (url, args) {
    const properties = getApiDocs(url, args);
    const lines = [];

    for (const propertyName in properties) {
        lines.push(tab + propertyName + "?: T;");
    }
    
    return lines.join("\n");
}
