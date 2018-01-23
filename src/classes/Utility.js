class Utility {}

Utility.findValue = (obj, access, fallback = null) => {
  if (!obj) {
    return fallback;
  }
  if (!access) {
    return obj;
  }
  access = access.split('.');
  while (access.length && obj !== undefined) {
    obj = obj[access.shift()];
  }
  if (obj === undefined) {
    return fallback;
  }
  return obj;
};

export default Utility;