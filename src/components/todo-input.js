const template = document.createElement('template');
template.innerHTML = `
<style>
</style>
<form>
  <input type="text" placeholder="input here some todo..." />
  <select name="category">
    <option value="Work">Work</option>
    <option value="Movie">Movie</option>
    <option value="Idea">Idea</option>
    <option value="Shop">Shop</option>
  </select>
</form>`;

export default class TodoInput extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._root.appendChild(template.content.cloneNode(true));

    this.$form = this._root.querySelector('form');
    this.$input = this._root.querySelector('input');
    this.$select = this._root.querySelector('select');

    this.$form.addEventListener('submit', this.onSubmit.bind(this));
  }

  onSubmit(e) {
    e.preventDefault();
    if (!this.$input.value) {
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
}
