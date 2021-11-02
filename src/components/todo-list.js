import * as todoStore from '../shared/store/todo';

const template = document.createElement('template');

template.innerHTML = `
<style>
.itemList {
  list-style-type: none;
}
</style>
<label class="categoryName"></label>
<ul class="itemList"></ul>
`;

export default class ItemList extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });

    this._list = this.list;
    this._category = this.category;
    this._category = this.filter;
  }

  connectedCallback() {
    this._root.appendChild(template.content.cloneNode(true));

    this.$categoryName = this._root.querySelector('.categoryName');
    this.$itemList = this._root.querySelector('.itemList');

    this._render();
  }

  static get observedAttributes() {
    return ['category', 'filter'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    switch (name) {
      case 'category':
        this._category = newVal;
        break;
      case 'filter':
        this._filter = newVal;
        this._render();
        break;
    }
  }

  removeItem(e) {
    const { val: item } = this._list[e.detail];
    todoStore.removeOne(item.category, item.title);

    this._list.splice(e.detail, 1);
    this._render();
  }

  toggleItem(e) {
    const { val: item } = this._list[e.detail];
    todoStore.updateOneDiff(item.category, item.title, {
      checked: !item.checked,
    });

    this._list[e.detail].val = Object.assign({}, item, {
      checked: !item.checked,
    });

    this._render();
  }

  getTodoList(category, filter) {
    const list = category
      ? todoStore.findByCategory(category)
      : todoStore.findAll();

    if (filter === '' || !Boolean(filter)) {
      return list;
    }

    switch (filter) {
      case 'all':
        return list;
      case 'yet':
        return list.filter(({ val: { checked } }) => !checked);
      case 'done':
        return list.filter(({ val: { checked } }) => checked);
    }
  }

  _render() {
    if (!this.$categoryName) {
      return;
    }

    this._list = this.getTodoList(this._category, this._filter);

    this.$categoryName.innerText = this._category;
    this.$itemList.innerHTML = '';

    this._list.forEach(({ key, val: item }, index) => {
      const $item = document.createElement('todo-item');
      $item.setAttribute('title', item.title);
      $item.setAttribute('created-at', item.createdAt);
      $item.setAttribute('updated-at', item.updatedAt);
      $item.setAttribute('category', item.category);
      $item.setAttribute('checked', item.checked);
      $item.setAttribute('index', index);

      $item.addEventListener('onRemove', this.removeItem.bind(this));
      $item.addEventListener('onToggle', this.toggleItem.bind(this));

      this.$itemList.appendChild($item);
    });
  }
}
