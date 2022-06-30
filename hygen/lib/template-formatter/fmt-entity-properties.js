const getApiDocs = require("../api/get-api-properties");
const tab = "  ";
/**
 *
 * @param {string} url
 * @param {string} args
 * @returns {Array<string>} Array of lines.
 */
module.exports = function getEntityPropsFormatted(url, args) {
  const properties = getApiDocs(url, args);
  const lines = [];

  for (const propertyName in properties) {
    const propertyValue = properties[propertyName];
    lines.push(tab + "'" + propertyName + "': {");
    lines.push(
      tab.repeat(2) +
      "label: _('" +
      getComposedPropertyName(propertyName) +
      "'),"
    );
    if (propertyValue.enum) {
      const enumObj = propertyValue.enum;
      lines.push(tab.repeat(2) + "enum: {");
      enumObj.forEach((enumValue) => {
        lines.push(
          tab.repeat(3) +
          "'" +
          enumValue +
          "' : _('" +
          getComposedPropertyName(enumValue) +
          "'),"
        );
      });
      lines.push(tab.repeat(2) + "},");
    }
    lines.push(tab + "},");
  }
  return lines.join("\n");
};

/**
 * @param {string} propertyName
 * @returns {string}
 */
function getComposedPropertyName(propertyName) {
  let formattedName = undefined;

  for (let i = 0; i < propertyName.length; i++) {
    const char = propertyName[i];

    if (char === char.toUpperCase() && i !== 0) {
      formattedName =
        propertyName.slice(0, i) +
        " " +
        propertyName[i].toUpperCase() +
        propertyName.slice(i + 1, propertyName.length + 1);
      break;
    }
  }
  if (!formattedName) {
    formattedName = propertyName;
  }

  return formattedName[0].toUpperCase() + formattedName.slice(1);
}
