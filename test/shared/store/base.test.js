import assert from 'power-assert';
import Store from '../../../src/shared/store/base';
import { parse } from '../../../src/shared/helper/json';

describe('base', () => {
  const prefix = 'test';
  let store;

  beforeEach(() => {
    store = new Store(prefix);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('constructor', () => {
    it('set keyPrefix', () => {
      assert.strictEqual(store.keyPrefix, prefix);
    });
  });

  describe('genKey', () => {
    it('possible generate key', () => {
      assert.strictEqual(store.genKey('A', 'B', 'C'), `${prefix}:A:B:C`);
    });

    it('return prefix if arguments is not string', () => {
      assert.strictEqual(store.genKey({}), prefix);
    });
  });

  describe('listAllItems', () => {
    const key = `${prefix}:0`;

    it('return array', () => {
      localStorage.setItem(key, JSON.stringify({ test: 'test' }));

      const result = store.listAllItems();

      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].val.test, 'test');
      assert.strictEqual(result[0].key, key);
    });

    it('return empty array', () => {
      const result = store.listAllItems();

      assert.strictEqual(result.length, 0);
    });
  });

  describe('remvoeAllItems', () => {
    const key = `${prefix}:0`;

    it('possible remove all items from localStorage', () => {
      localStorage.setItem(key, 'test');

      assert.strictEqual(localStorage.length, 1);

      store.removeAllItems();

      assert.strictEqual(localStorage.length, 0);
    });
  });

  describe('getItem', () => {
    const key = `${prefix}:0`;

    it('possible get item from localStorage', () => {
      localStorage.setItem(key, 'test');

      assert.strictEqual(store.getItem(key), 'test');
    });

    it('possible get parsed item ', () => {
      localStorage.setItem(key, JSON.stringify({ key, val: 'test' }));

      const result = store.getItem(key);

      assert.strictEqual(result.key, key);
      assert.strictEqual(result.val, 'test');
    });

    it('return null if not found', () => {
      const result = store.getItem(key);

      assert.strictEqual(localStorage.length, 0);
      assert.strictEqual(result, null);
    });
  });

  describe('setItem', () => {
    const key = `${prefix}:0`;

    it('possible set item to localStorage', () => {
      assert.strictEqual(localStorage.length, 0);

      store.setItem(key, 'test');

      assert.strictEqual(localStorage.length, 1);
      assert.strictEqual(parse(localStorage.getItem(key)), 'test');
    });

    it('possible set item with object to localStorage', () => {
      assert.strictEqual(localStorage.length, 0);

      store.setItem(key, { test: 'test' });

      assert.strictEqual(localStorage.length, 1);
      assert.strictEqual(parse(localStorage.getItem(key)).test, 'test');
    });
  });

  describe('updateItem', () => {
    const key = `${prefix}:0`;

    it('possible update item', () => {
      localStorage.setItem(key, 'test');

      assert.strictEqual(parse(localStorage.getItem(key)), 'test');

      store.updateItem(key, 'updated');
      assert.strictEqual(parse(localStorage.getItem(key)), 'updated');
    });

    it('possible update item with object', () => {
      localStorage.setItem(key, JSON.stringify({ testA: 'testA' }));

      assert.deepStrictEqual(parse(localStorage.getItem(key)), {
        testA: 'testA',
      });

      store.updateItem(key, 'updated');
      assert.deepStrictEqual(parse(localStorage.getItem(key)), 'updated');
    });
  });

  describe('updateItemDiff', () => {
    const key = `${prefix}:0`;

    it('possible update item', () => {
      localStorage.setItem(key, 'test');

      assert.strictEqual(parse(localStorage.getItem(key)), 'test');

      store.updateItemDiff(key, 'updated');
      assert.strictEqual(parse(localStorage.getItem(key)), 'updated');
    });

    it('possible update item with object differences only', () => {
      const before = { testA: 'testA', testB: 'testB' };
      localStorage.setItem(key, JSON.stringify(before));

      assert.deepStrictEqual(parse(localStorage.getItem(key)), before);

      store.updateItemDiff(key, { testA: 'testAUpdated' });

      assert.deepStrictEqual(parse(localStorage.getItem(key)), {
        testA: 'testAUpdated',
        testB: before.testB,
      });
    });
  });

  describe('removeItem', () => {
    it('possible remove item from localStorage', () => {
      const keyA = `${prefix}:0`;
      const keyB = `${prefix}:1`;
      localStorage.setItem(keyA, 'testA');
      localStorage.setItem(keyB, 'testB');

      assert.strictEqual(localStorage.length, 2);

      store.removeItem(keyA);

      assert.strictEqual(localStorage.length, 1);
      assert.strictEqual(localStorage.getItem(keyA), null);
      assert.strictEqual(localStorage.getItem(keyB), 'testB');
    });
  });

  describe('findItems', () => {
    beforeEach(() => {
      localStorage.setItem('dummyKey', 'dummyValue');
      [...Array(3)].forEach((_, index) => {
        localStorage.setItem(`${prefix}:${index}`, JSON.stringify({ index }));
      });
    });

    it('possible find items form localStorage with query', () => {
      const result = store
        .findItems(prefix)
        .sort((a, b) => a.val.index - b.val.index);

      assert.strictEqual(localStorage.length, 4);
      assert.strictEqual(result.length, 3);
      assert.strictEqual(result[0].key, `${prefix}:0`);
      assert.strictEqual(result[0].val.index, 0);
      assert.strictEqual(result[1].key, `${prefix}:1`);
      assert.strictEqual(result[1].val.index, 1);
      assert.strictEqual(result[2].key, `${prefix}:2`);
      assert.strictEqual(result[2].val.index, 2);
    });

    it('return empty array if not found', () => {
      const result = store.findItems('foo');

      assert.strictEqual(localStorage.length, 4);
      assert.strictEqual(result.length, 0);
    });
  });

  describe('findItemsByPrefixes', () => {
    beforeEach(() => {
      localStorage.setItem('dummyKey', 'dummyValue');
      [...Array(3)].forEach((_, index) => {
        localStorage.setItem(
          `${prefix}:foo:bar:${index}`,
          JSON.stringify({ index })
        );
        localStorage.setItem(
          `${prefix}:hoge:fuga:${index}`,
          JSON.stringify({ index })
        );
      });
    });

    it('possible find items from localStorage with some prefixes', () => {
      const result = store
        .findItemsByPrefixes('foo', 'bar')
        .sort((a, b) => a.val.index - b.val.index);

      assert.strictEqual(localStorage.length, 7);
      assert.strictEqual(result.length, 3);
      assert.strictEqual(result[0].key, `${prefix}:foo:bar:0`);
      assert.strictEqual(result[0].val.index, 0);
      assert.strictEqual(result[1].key, `${prefix}:foo:bar:1`);
      assert.strictEqual(result[1].val.index, 1);
      assert.strictEqual(result[2].key, `${prefix}:foo:bar:2`);
      assert.strictEqual(result[2].val.index, 2);
    });

    it('find according to prefix order', () => {
      const result = store.findItemsByPrefixes('bar', 'foo');

      assert.strictEqual(localStorage.length, 7);
      assert.strictEqual(result.length, 0);
    });
  });
});
