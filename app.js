
const BASE_URL = 'https://62860d1f96bccbf32d6e2bf5.mockapi.io/todos'

let todosArray = [];


function goToTodoPage(id) {
  let urlString = "/todo.html"
  if (id) {
    urlString = urlString + '?id=' + id;  ///parametri url ricerca: http://127.0.0.1:5500/todo.html?id=1 
  }
  window.location.href = urlString;
}

// function goToTodoPage2(todo){
//   let urlString = "/todo.html"
//   if (todo) {
//     const todoString = JSON.stringify(todo);
//     sessionStorage.setItem('selectedTodo', todoString);
//   }
//   window.location.href = urlString;
// }


function populateTagContainer(container, tags) {
  for (const tag of tags) {
    const span = document.createElement('span');
    span.classList.add('chip');
    const node = document.createTextNode('#' + tag);
    span.appendChild(node);
    container.appendChild(span)
  }
}


function createTodoCard(todo) {

  const cardTemplate = `
      <span class="todo-name">#NAME</span>
      <div class="tag-container"></div>
      <span>#CREATIONDATE</span>
      <div class="divider"></div>
      <div class="buttons-container">
        <button class="delete-button"><img width="20px" src="./assets/delete.svg" alt=""></button>
        <button class="edit-button"><img width="20px" src="./assets/edit.svg" alt=""></button>
        <button class="done-button"><img width="20px" src="./assets/check.svg" alt=""></button>
        </div>`


  //const humanDate = new Date(todo.creationDate * 1000)
  const todoHtml = cardTemplate.replace('#NAME', todo.name)
    .replace('#CREATIONDATE', todo.creationDate.toLocaleString())
  console.log(todo);

  return todoHtml;
}

function startLoading() {
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

function filterTodos(t1, t2) {
  return t1.id !== t2.id;
}

function removeTodoAndRefesh(todo) {
  stopLoading()
  todosArray = todosArray.filter(t1 => filterTodos(t1, todo))
  displayTodos(todosArray);
}

function deleteTodo(id) {
  ///const confermdeleat = conferm('qualcosa')
  /* if (confermdeleat) {startLoading()
  const deleteUrl = BASE_URL + '/' + id;
  const fetchOptions = {method: 'delete'};
  fetch(deleteUrl, fetchOptions)
  .then(response => response.json())
  .then(result => removeTodoAndRefesh(result))
  .catch(error => stopLoading())} */

  startLoading()
  const deleteUrl = BASE_URL + '/' + id;
  const fetchOptions = { method: 'delete' };
  fetch(deleteUrl, fetchOptions)
    .then(response => response.json())
    .then(result => removeTodoAndRefesh(result))
    .catch(error => stopLoading())
}

function displayTodos(todos) {

  const todosContainer = document.getElementById('todos-container');

  todosContainer.innerHTML = '';

  for (const todo of todos) {

    const todoCard = document.createElement('div');
    todoCard.classList.add('todo-card');

    todoCard.innerHTML = createTodoCard(todo);

    const tagContainer = todoCard.querySelector('.tag-container');

    populateTagContainer(tagContainer, todo.tags)

    const deleteButton = todoCard.querySelector('.delete-button');
    deleteButton.onclick = () => confirmDeletion(todo.id);  //deletebutton


    const editButton = todoCard.querySelector('.edit-button');
    editButton.onclick = () => goToTodoPage(todo.id); //editButton


    const divider = todoCard.querySelector('.divider');
    divider.style.backgroundColor = todo.priority.color;

    // const span = document.createElement('span');
    // const nameNode = document.createTextNode(todo.name);
    // span.appendChild(nameNode);

    // todoCard.appendChild(span);

    // const button = document.createElement('button');
    // button.onclick = () => deleteTodo(todo.id)
    // const deleteNode = document.createTextNode('delete');
    // button.appendChild(deleteNode);

    // todoCard.appendChild(button);

    todosContainer.appendChild(todoCard);

  }

}

function initTodos(todos) {
  stopLoading();
  console.log(todos);
  todosArray = todos.map(obj => Todo.fromDbObj(obj));
  todosArray.sort(Todo.orderTodoPriority)  /// da cambiare
  displayTodos(todosArray);
}

function orderTodoPriority(t1, t2) {
  return t2.priority.order - t1.priority.order;
} ///

function loadTodos() {
  startLoading()
  fetch(BASE_URL)
    .then(response => response.json())
    .then(result => initTodos(result))
  //.catch(error => stopLoading())
}



function confirmDeletion(id) {
  const answer = prompt("scrivi 'si' per cancellare la task")
  if (answer === 'si') deleteTodo(id)

}

loadTodos()


