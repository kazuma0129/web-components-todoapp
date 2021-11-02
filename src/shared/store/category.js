import Store from './base';
import { STORE_KEY_PREFIX_CATEGORY } from '../constant';
const store = new Store(STORE_KEY_PREFIX_CATEGORY);

export const genKey = (...keys) => {
  return keys.reduce((ret, key, index) => {
    return index === keys.length - 1
      ? `${ret}${key}`
      : `${ret}${key}${STORE_KEY_DELIMITER}`;
  }, `${store.keyPrefix}${STORE_KEY_DELIMITER}`);
};

export const findOne = (category, title) => {
  const key = genKey(category, title);
  return store.getItem(key);
};

export const removeOne = (category, title) => {
  const key = genKey(category, title);
  return store.removeItem(key);
};

export const removeMany = () => {};

export const createOne = () => {};

export const createMany = () => {};

export const updateOne = () => {};

export const updateOneDiff = () => {};

export const find = () => {};
