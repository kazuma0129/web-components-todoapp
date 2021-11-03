import * as categoryStore from '../shared/store/category';

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

    this._categories = categoryStore.findAllCustom();
  }

  connectedCallback() {
    this._root.appendChild(template.content.cloneNode(true));

    this.$categoryList = this._root.querySelector('ul');

    this.$section = this._root.querySelector('section');

    this.$categoryAddButton = document.createElement('button');
    this.$categoryAddButton.setAttribute('class', 'categoryAddButton');
    this.$categoryAddButton.textContent = '➕';
    this.$categoryAddButton.addEventListener('click', (e) => {
      this.$categoryList.appendChild(this.createCategoryInputElement());
      this.$section.removeChild(this.$categoryAddButton);
    });

    this.$section.appendChild(this.$categoryAddButton);

    this._render();
  }

  createCategoryInputElement() {
    const $categoryInput = document.createElement('category-input');
    $categoryInput.addEventListener(
      'onCategorySubmit',
      this.onCategorySubmit.bind(this)
    );
    return $categoryInput;
  }

  onCategorySubmit(e) {
    categoryStore.createOne({ name: e.detail.name });
    this.$categoryList.removeChild(this.$categoryList.lastChild);
    this.$categoryList.appendChild(
      this.createCategoryItemElement(e.detail.name)
    );
    this.$section.appendChild(this.$categoryAddButton);
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

  createCategoryItemElement(categoryName) {
    const $categoryItem = document.createElement('category-one');
    $categoryItem.setAttribute('category-name', categoryName);
    $categoryItem.addEventListener(
      'onCategoryClick',
      this.onCategoryClick.bind(this)
    );
    return $categoryItem;
  }

  _render() {
    this.$categoryList.innerHTML = '';
    this._categories.forEach((categoryName) => {
      this.$categoryList.appendChild(
        this.createCategoryItemElement(categoryName)
      );
    });
  }
}
