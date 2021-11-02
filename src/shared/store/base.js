import { STORE_KEY_DELIMITER } from '../constant';

export default class Store {
  constructor(keyPrefix) {
    this.keyPrefix = keyPrefix;
  }

  genKey(...keys) {
    return keys.reduce((ret, key, index) => {
      if (typeof key != 'string') {
        return ret;
      }
      return index === keys.length - 1
        ? `${ret}${key}`
        : `${ret}${key}${STORE_KEY_DELIMITER}`;
    }, `${this.keyPrefix}${STORE_KEY_DELIMITER}`);
  }

  listAllItems() {
    const results = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      results.push({
        key,
        val: JSON.parse(localStorage.getItem(key)),
      });
    }
    return results;
  }

  removeAllItems() {
    localStorage.clear();
  }

  getItem(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  setItem(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  updateItem(key, val) {
    if (!this.getItem(key)) {
      return new Error(`not found. ${key}`);
    }
    this.setItem(key, val);
  }

  updateItemDiff(key, val) {
    const before = this.getItem(key);
    if (!before) {
      return new Error(`not found. ${key}`);
    }
    this.setItem(key, { ...before, ...val });
  }

  findItems(query) {
    const results = [];
    for (let i in localStorage) {
      if (localStorage.hasOwnProperty(i)) {
        if (i.match(query) || (!query && typeof i === 'string')) {
          results.push({ key: i, val: JSON.parse(localStorage.getItem(i)) });
        }
      }
    }
    return results;
  }

  findItemsByPrefix(...prefixes) {
    const query = this.genKey(...prefixes);
    return this.findItems(query);
  }

  removeItem(key) {
    localStorage.removeItem(key);
  }
}
