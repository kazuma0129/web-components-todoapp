const template = document.createElement('template');
template.innerHTML = `
<style>
</style>
<li>
  <label></label>
</li>
`;

export default class CategoryOne extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });

    this._categoryName = this.categoryName;
  }

  connectedCallback() {
    this._root.appendChild(template.content.cloneNode(true));

    this.$categoryItem = this._root.querySelector('li');
    this.$categoryName = this._root.querySelector('label');

    this.$categoryItem.addEventListener(
      'click',
      this.onCategoryClick.bind(this)
    );

    this._render();
  }

  static get observedAttributes() {
    return ['category-name'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    switch (name) {
      case 'category-name':
        this._categoryName = newVal;
        break;
    }
  }

  onCategoryClick(e) {
    e.preventDefault();
    this.dispatchEvent(
      new CustomEvent('onCategoryClick', {
        bubbles: true,
        composed: true,
        detail: {
          categoryName: this._categoryName,
        },
      })
    );
  }

  _render() {
    if (!this._categoryName) {
      return;
    }
    this.$categoryName.textContent = this._categoryName;
  }
}
