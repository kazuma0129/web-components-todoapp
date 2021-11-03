import { isURL, isHTTPS } from '../shared/helper/url';

export const validate = (text) => {
  if (!text) {
    throw new Error('title must have at least 1 character');
  }

  if (text.length > 128) {
    throw new Error(`title length must less than 128, got ${text.length}`);
  }

  if (isURL(text) && !isHTTPS(text)) {
    throw new Error(`do not input external link "http:"`);
  }
  return;
};
