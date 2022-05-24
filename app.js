
const BASE_URL = 'https://628b2f12667aea3a3e290de6.mockapi.io/todos'

let todosArray = [];

function startLoading(){
  const loader = document.getElementById('loader')
  loader.style.display = 'inline-block'
  const refresh = document.getElementById('refresh-button');
  refresh.style.display = 'none';
}

function stopLoading() {
  const loader = document.getElementById('loader')
  loader.style.display = 'none'
  const refresh = document.getElementById('refresh-button');
  refresh.style.display = 'inline-block';
}

function filterTodos(t1, t2){
  return t1.id !== t2.id;
}

function removeTodoAndRefesh(todo){
  stopLoading()
  todosArray = todosArray.filter(t1 => filterTodos(t1, todo))
  displayTodos(todosArray);
}

function deleteTodo(id){
  startLoading()
  const deleteUrl = BASE_URL + '/' + id;
  const fetchOptions = {method: 'delete'};
  fetch(deleteUrl, fetchOptions)
  .then(response => response.json())
  .then(result => removeTodoAndRefesh(result))
  .catch(error => stopLoading())
}

function displayTodos(todos){

  const todosContainer = document.getElementById('todos-container');

  todosContainer.innerHTML = '';

  for (const todo of todos) {

    const todoCard = document.createElement('div');

    const span = document.createElement('span');
    const nameNode = document.createTextNode(todo.name);
    span.appendChild(nameNode);

    todoCard.appendChild(span);

    const button = document.createElement('button');
    button.onclick = () => deleteTodo(todo.id)
    const deleteNode = document.createTextNode('delete');
    button.appendChild(deleteNode);

    todoCard.appendChild(button);

    todosContainer.appendChild(todoCard);

  }
  
}

function initTodos(todos){
  stopLoading();
  todosArray = todos;
  displayTodos(todosArray);
}

function loadTodos(){
  startLoading()
  fetch(BASE_URL)
  .then(response => response.json())
  .then(result => initTodos(result))
  .catch(error => stopLoading())
}

loadTodos()


