export const isURL = (str) => {
  let result;
  try {
    result = new URL(str);
  } catch (e) {
    result = e;
  }
  return !(result instanceof TypeError);
};

export const isHTTPS = (str) => {
  if (!isURL(str)) {
    return false;
  }
  const url = new URL(str);
  return url.protocol === 'https:';
};
