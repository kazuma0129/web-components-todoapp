import { CATEGORIES_DEFAULT } from '../shared/constant';

const template = document.createElement('template');
template.innerHTML = `
<style>
ul {
  list-style-type: none;
}
.clicked {
  font-weight: bold;
}
</style>
<section>
  <ul></ul>
</section>
`;

export default class CategoryList extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });
    this.beforeElement = '';
  }

  connectedCallback() {
    this._root.appendChild(template.content.cloneNode(true));

    this.$categoryList = this._root.querySelector('ul');
    this._render();
  }

  onCategoryClick(e) {
    const $categoryItem = e.target;
    if (this.beforeElement === $categoryItem) {
      $categoryItem.classList.remove('clicked');
      this.beforeElement = '';
      return;
    }
    if (this.beforeElement.classList) {
      this.beforeElement.classList.remove('clicked');
    }
    $categoryItem.classList.add('clicked');
    this.beforeElement = $categoryItem;
  }

  _render() {
    CATEGORIES_DEFAULT.forEach((categoryName) => {
      const $categoryItem = document.createElement('category-one');
      $categoryItem.setAttribute('category-name', categoryName);
      $categoryItem.addEventListener(
        'onCategoryClick',
        this.onCategoryClick.bind(this)
      );
      this.$categoryList.appendChild($categoryItem);
    });
  }
}
