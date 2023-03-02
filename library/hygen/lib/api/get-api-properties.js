const mergeProperties = require("../merger/merger-properties");

/**
 * Retrieve properties of a given api for a given EntityName located,
 * in the API definitions section.
 *
 * @param {string} url
 * @param {string} entityName
 * @returns Array of properties
 *
 */
function getApiProperties(url, entityName) {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; // no-check-certificate
  const request = require("sync-request");

  let res = request("GET", url, {
    headers: {
      "Content-type": "application/json",
    },
  });
  let data = JSON.parse(res.getBody("utf8"));
  let definitions = data.definitions;
  let properties = definitions[entityName]
    ? definitions[entityName]["properties"]
    : {};

  for (const definitionName in definitions) {
    if (definitionName === entityName || definitionName.indexOf(entityName + "-") === 0) {
      properties = mergeProperties(
        properties,
        definitions[definitionName]["properties"]
      );
    }
  }
  return properties;
}

module.exports = getApiProperties;
