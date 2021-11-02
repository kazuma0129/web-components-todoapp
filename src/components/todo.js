import * as todoStore from '../shared/store/todo';

const CATEGORIES = ['Work', 'Movie', 'Idea', 'Shop'];

const STATUS = ['all', 'yet', 'done'];

const template = document.createElement('template');
template.innerHTML = `
<style>
section {
  display: grid;
  grid-gap: 10px;
  /* grid-template-columns: 200px 200px 200px; */
  grid-template-areas:
  "header  header  header"
  "sidebar content content"
  "footer  footer  footer";
  background-color: #fff;
}

.box {
  /* background-color: #444; */
  /* color: #fff; */
  /* border-radius: 5px;
  padding: 50px;
  font-size: 150%; */
}

.content {
  grid-area: content;
  position: relative;
}

.category-list {
  grid-area: sidebar;
}

</style>
<section>
  <category-list class="box category-list"></category-list>

  <div class="box content">
    <div>
      <todo-input></todo-input>
      <span>filter status</span>
      <select class="todo-list-filter">
        <option>all</option>
        <option>yet</option>
        <option>done</option>
      </select>
    </div>
    <ul class="todo-list-container" ></ul>
  </div>
</section>
`;

export default class Todo extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });

    this._categories = CATEGORIES;
    this._beforeClickCategory = '';

    this._filter = 'yet'; // default filter status
  }

  onCategoryClick(e) {
    if (this._beforeClickCategory === e.detail.categoryName) {
      this._beforeClickCategory = '';
      this._categories = CATEGORIES;
    } else {
      this._beforeClickCategory = e.detail.categoryName;
      this._categories = [e.detail.categoryName];
    }
    this._render();
  }

  onToggleFilter(e) {
    e.preventDefault();
    this._filter = this.$todoListFilter.value;
    this._render();
  }

  connectedCallback() {
    this._root.appendChild(template.content.cloneNode(true));

    this.$input = this._root.querySelector('todo-input');
    this.$input.addEventListener('onSubmit', this.addItem.bind(this));

    this.$todoListContainer = this._root.querySelector('.todo-list-container');
    this.$todoListFilter = this._root.querySelector('.todo-list-filter');
    this.$todoListFilter.value = this._filter;

    this.$todoListFilter.addEventListener(
      'change',
      this.onToggleFilter.bind(this)
    );

    this.$categoryList = this._root.querySelector('category-list');
    this.$categoryList.addEventListener(
      'onCategoryClick',
      this.onCategoryClick.bind(this)
    );

    this._render();
  }

  addItem(e) {
    const item = {
      title: e.detail.title,
      category: e.detail.category,
      checked: false,
    };
    todoStore.createOne(item);
    this._render();
  }

  _render() {
    if (!this.$todoListContainer) {
      return;
    }

    // 毎回リスト毎に再度レンダリングしているのでリファクタしたい
    this.$todoListContainer.innerHTML = '';

    this._categories.forEach((category) => {
      const $todoList = document.createElement('todo-list');
      $todoList.setAttribute('category', category);
      $todoList.setAttribute('filter', this._filter);
      this.$todoListContainer.appendChild($todoList);
    });
  }
}
