import Store from './base';
import { STORE_KEY_PREFIX_FILTER } from '../constant';
const store = new Store(STORE_KEY_PREFIX_FILTER);

export const findOne = () => {
  const key = store.genKey();
  return store.getItem(key);
};

export const createOne = (status) => {
  const key = store.genKey();
  return store.setItem(key, status);
};

export const upsert = (status) => {
  return createOne(status);
};
