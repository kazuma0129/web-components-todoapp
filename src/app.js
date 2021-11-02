import Todo from './components/todo';
import TodoInput from './components/todo-input';
import TodoOne from './components/todo-one';
import TodoList from './components/todo-list';
window.customElements.define('todo-main', Todo);
window.customElements.define('todo-input', TodoInput);
window.customElements.define('todo-item', TodoOne);
window.customElements.define('todo-list', TodoList);

import CategoryList from './components/category-list';
import CategoryOne from './components/category-one';
window.customElements.define('category-list', CategoryList);
window.customElements.define('category-one', CategoryOne);

import ButtonCircle from './components/button-circle';
window.customElements.define('button-circle', ButtonCircle);
