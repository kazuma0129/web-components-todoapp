export const parse = (str) => {
  let result;
  try {
    result = JSON.parse(str);
  } catch {
    result = str;
  }
  return result;
};
