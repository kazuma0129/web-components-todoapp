import Store from './base';
import { STORE_KEY_PREFIX_TODO } from '../constant';
const store = new Store(STORE_KEY_PREFIX_TODO);

export const genKey = (category, title) => {
  return store.genKey(category, title);
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

export const createOne = ({ category, title, checked }) => {
  const key = genKey(category, title);
  return store.setItem(key, { category, title, checked });
};

export const createMany = () => {};

export const updateOneDiff = (category, title, updateObj) => {
  const before = findOne(category, title);
  if (!before) {
    return new Error(`not found. ${category},${title}`);
  }
  // index無いから消えた後のレンダリングで順序が変わる
  removeOne(category, title);
  return createOne({ ...before, ...updateObj });
};

export const findAll = () => {
  return store.listAllItems();
};

export const findByCategory = (category) => {
  return store.findItemsByPrefixes(category);
};
