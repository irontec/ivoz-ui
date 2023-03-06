const getApiDocs = require("../api/get-api-properties");
const tab = "  ";

/**
 *
 * @param {string} url
 * @param {string} args
 * @returns {Array<string>}
 */
module.exports = function (url, args) {
  const properties = getApiDocs(url, args);
  console.log('getApiDocs', getApiDocs);
  const lines = [];

  for (const propertyName in properties) {
    lines.push(tab.repeat(4) + "'" + propertyName + "',");
  }

  return lines.join("\n");
};
