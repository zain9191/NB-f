 
/** 
 * @param {string} str  
 * @returns {string[]}  
 */
export const splitAndTrim = (input) => {
  if (typeof input === "string") {
    return input
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
  } else if (Array.isArray(input)) {
    return input.map((item) => item.trim()).filter((item) => item);
  } else {
    return [];
  }
};