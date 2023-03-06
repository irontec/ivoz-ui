/**
 * Merge unexistent properties and return a new
 * array of properties.
 *
 * @param {Array<string>} old Represents old properties.
 * @param {Array<string>} newProps Representes new properties that could be merged.
 * @return Array<string> of strings with merged properties.
 */
module.exports = function (old, newProps) {
  if (old) {
    for (const property in newProps) {
      if (!propertyExist(old, property)) {
        old[property] = newProps[property];
      }
    }
  }

  return old ? old : newProps;
};

/**
 *
 * @param {Array<string>} properties Array of strings representing properties.
 * @param {string} property Property to check if exist.
 * @return {boolean}boolean value
 */
function propertyExist(properties, property) {
  for (const prop in properties) {
    if (prop === property) {
      return true;
    }
  }

  return false;
}
