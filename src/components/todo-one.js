import * as todoStore from '../shared/store/todo';

const template = document.createElement('template');

template.innerHTML = `
<style>
.checked {
  text-decoration: line-through;
  color: #aaa; 
}
</style>
<li class="item">
  <input class="checkbox" type="checkbox">
  <label contenteditable class="title"></label>
  <button class="removeButton">x</button>
</li>
`;

export default class ItemOne extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });

    this._title = this.title;
    this._createdAt = this.createdAt;
    this._updatedAt = this.updatedAt;
    this._category = this.category;
    this._checked = this.checked;
    this._index = this.index;
  }

  static get observedAttributes() {
    return [
      'title',
      'created-at',
      'updated-at',
      'category',
      'index',
      'checked',
    ];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    switch (name) {
      case 'title':
        this._title = newVal;
        break;
      case 'created-at':
        this._createdAt = newVal;
        break;
      case 'updated-at':
        this._updatedAt = newVal;
        break;
      case 'category':
        this._category = newVal;
        break;
      case 'index':
        this._index = newVal;
        break;
      case 'checked':
        this._checked = newVal === 'true';
        break;
    }
  }

  connectedCallback() {
    this._root.appendChild(template.content.cloneNode(true));

    this.$item = this._root.querySelector('.item');
    this.$checkbox = this._root.querySelector('.checkbox');
    this.$title = this._root.querySelector('.title');
    this.$removeButton = this._root.querySelector('.removeButton');

    this.$checkbox.addEventListener('click', (e) => {
      e.preventDefault();
      this.dispatchEvent(new CustomEvent('onToggle', { detail: this._index }));
    });

    this.$removeButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.dispatchEvent(new CustomEvent('onRemove', { detail: this._index }));
    });

    this.$title.addEventListener('keypress', (e) => {
      if (e.keyCode != 13) {
        return;
      }
      this.$title.blur();
      todoStore.updateOneDiff(this._category, this._title, {
        title: this.$title.innerText,
      });
      this._title = this.$title.innerText;
    });

    this._render();
  }

  _render() {
    if (!this.$item) {
      return;
    }

    this.$title.textContent = this._title;

    if (this._checked) {
      this.$title.classList.add('checked');
      this.$checkbox.setAttribute('checked', 'checked');
    } else {
      this.$title.classList.remove('checked');
      this.$checkbox.removeAttribute('checked');
    }
  }
}
