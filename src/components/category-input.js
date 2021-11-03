import * as textServices from '../shared/services/text';

const template = document.createElement('template');
template.innerHTML = `
<form>
  <input type="text" placeholder="create new category">
</form>
`;

export default class CategoryList extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });

    this._categoryAddButtonPressed = false;
  }

  connectedCallback() {
    this._root.appendChild(template.content.cloneNode(true));

    this.$form = this._root.querySelector('form');
    this.$input = this._root.querySelector('input');

    this.$form.addEventListener('submit', this.onCategorySubmit.bind(this));
  }

  onCategorySubmit(e) {
    e.preventDefault();

    try {
      textServices.validate(this.$input.value);
    } catch (err) {
      window.alert(err.message);
      return;
    }

    this.dispatchEvent(
      new CustomEvent('onCategorySubmit', {
        bubbles: true,
        composed: true,
        detail: {
          name: this.$input.value,
        },
      })
    );

    this.$input.value = '';
  }
}
