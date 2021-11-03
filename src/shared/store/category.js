import Store from './base';
import { STORE_KEY_PREFIX_CATEGORY, CATEGORIES_DEFAULT } from '../constant';

const store = new Store(STORE_KEY_PREFIX_CATEGORY);

export const genKey = (name) => {
  return store.genKey(name);
};

export const findOne = (name) => {
  const key = genKey(name);
  return store.getItem(key);
};

export const removeOne = (name) => {
  const key = genKey(name);
  return store.removeItem(key);
};

export const createOne = ({ name }) => {
  const key = genKey(name);
  return store.setItem(key, { name });
};

export const updateOneDiff = (name, updateObj) => {
  const before = findOne(name);
  if (!before) {
    return new Error(`not found. ${name}`);
  }
  removeOne(name);
  return createOne({ ...before, ...updateObj });
};

export const findAllCustom = (fn = (c) => c.val.name) => {
  return [...CATEGORIES_DEFAULT, ...store.findItemsByPrefixes().map(fn)];
};
