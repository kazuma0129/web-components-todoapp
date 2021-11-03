import * as textServices from '../shared/services/text';
import { CATEGORIES_DEFAULT } from '../shared/constant';

const template = document.createElement('template');
template.innerHTML = `
<style>
</style>
<form>
  <input type="text" placeholder="type here some todo..." />
  <select name="category">
  </select>
</form>`;

export default class TodoInput extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });

    this._category = this.category;
  }

  static get observedAttributes() {
    return ['category'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    switch (name) {
      case 'category':
        this._category = newVal;
        this.$select.value = this._category;
        break;
    }
  }

  connectedCallback() {
    this._root.appendChild(template.content.cloneNode(true));

    this.$form = this._root.querySelector('form');
    this.$input = this._root.querySelector('input');
    this.$select = this._root.querySelector('select');

    this.$form.addEventListener('submit', this.onSubmit.bind(this));

    this._render();
  }

  onSubmit(e) {
    e.preventDefault();

    try {
      textServices.validate(this.$input.value);
    } catch (err) {
      window.alert(err.message);
      return;
    }

    this.dispatchEvent(
      new CustomEvent('onSubmit', {
        detail: {
          title: this.$input.value,
          category: this.$select.value,
        },
      })
    );
    this.$input.value = '';
  }

  _render() {
    CATEGORIES_DEFAULT.forEach((category) => {
      const $option = document.createElement('option');
      $option.setAttribute('value', category);
      $option.textContent = category;
      this.$select.appendChild($option);
    });
  }
}
