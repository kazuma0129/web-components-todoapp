const template = document.createElement('template');
template.innerHTML = `
<style>
.circle-button {
  border: none;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 50%;
}
</style>
<button class="circle-button"></button>
`;

export default class TodoInput extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });
    this._text = this.text;
  }

  connectedCallback() {
    this._root.appendChild(template.content.cloneNode(true));
    this.$button = this._root.querySelector('.circle-button');
    this._render();
  }

  _render() {
    if (!this._text) {
      return;
    }
    this.$button.innerText = this._text;
  }
}
