const taskForm = document.getElementById('taskForm');
const titleInput = document.getElementById('taskTitle');
const ownerInput = document.getElementById('taskOwner');
const dueInput = document.getElementById('taskDue');
const priorityInput = document.getElementById('taskPriority');
const focusTopButton = document.getElementById('newTaskTop');
const formFeedback = document.getElementById('formFeedback');
const kpiTotal = document.getElementById('totalCountKpi');

const lists = {
  todo: document.getElementById('todoList'),
  doing: document.getElementById('doingList'),
  done: document.getElementById('doneList')
};

const counters = {
  total: document.getElementById('totalCount'),
  todo: document.getElementById('todoCount'),
  doing: document.getElementById('doingCount'),
  done: document.getElementById('doneCount'),
  todoBadge: document.getElementById('todoBadge'),
  doingBadge: document.getElementById('doingBadge'),
  doneBadge: document.getElementById('doneBadge')
};

const statuses = ['todo', 'doing', 'done'];

const state = {
  tasks: [
    {
      id: crypto.randomUUID(),
      title: 'Diseñar flujo de onboarding',
      owner: 'Andrea',
      due: '2026-06-10',
      priority: 'Alta',
      status: 'todo'
    },
    {
      id: crypto.randomUUID(),
      title: 'Configurar reportes semanales',
      owner: 'Miguel',
      due: '2026-06-12',
      priority: 'Media',
      status: 'doing'
    },
    {
      id: crypto.randomUUID(),
      title: 'Publicar guía de procesos',
      owner: 'Luisa',
      due: '2026-06-05',
      priority: 'Baja',
      status: 'done'
    }
  ]
};

const formatDate = (isoDate) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) {
    return 'Sin fecha';
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString('es-ES', { timeZone: 'UTC' });
};

const clearNode = (node) => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};

const nextStatus = (status) => {
  const currentIndex = statuses.indexOf(status);
  const nextIndex = (currentIndex + 1) % statuses.length;
  return statuses[nextIndex];
};

const statusLabels = {
  todo: 'Pendiente',
  doing: 'En progreso',
  done: 'Completado'
};

const createTaskCard = (task) => {
  const card = document.createElement('article');
  card.className = 'task-card';

  const title = document.createElement('h3');
  title.textContent = task.title;

  const owner = document.createElement('p');
  owner.className = 'meta';
  owner.textContent = `Responsable: ${task.owner}`;

  const due = document.createElement('p');
  due.className = 'meta';
  due.textContent = `Fecha: ${formatDate(task.due)}`;

  const row = document.createElement('div');
  row.className = 'card-row';

  const priority = document.createElement('span');
  priority.className = 'priority';
  priority.dataset.level = task.priority;
  priority.textContent = task.priority;

  const actions = document.createElement('div');
  actions.className = 'actions';

  const moveButton = document.createElement('button');
  moveButton.className = 'btn secondary';
  moveButton.type = 'button';
  const next = nextStatus(task.status);
  moveButton.textContent = `Mover a ${statusLabels[next]}`;
  moveButton.addEventListener('click', () => {
    task.status = nextStatus(task.status);
    renderBoard();
  });

  const deleteButton = document.createElement('button');
  deleteButton.className = 'btn danger';
  deleteButton.type = 'button';
  deleteButton.textContent = 'Eliminar';
  deleteButton.addEventListener('click', () => {
    state.tasks = state.tasks.filter((item) => item.id !== task.id);
    renderBoard();
  });

  actions.append(moveButton, deleteButton);
  row.append(priority, actions);

  card.append(title, owner, due, row);

  return card;
};

const updateSummary = () => {
  const todoCount = state.tasks.filter((task) => task.status === 'todo').length;
  const doingCount = state.tasks.filter((task) => task.status === 'doing').length;
  const doneCount = state.tasks.filter((task) => task.status === 'done').length;

  counters.total.textContent = String(state.tasks.length);
  counters.todo.textContent = String(todoCount);
  counters.doing.textContent = String(doingCount);
  counters.done.textContent = String(doneCount);
  counters.todoBadge.textContent = String(todoCount);
  counters.doingBadge.textContent = String(doingCount);
  counters.doneBadge.textContent = String(doneCount);

  if (kpiTotal) {
    kpiTotal.textContent = String(state.tasks.length);
  }
};

const renderColumn = (statusKey) => {
  const list = lists[statusKey];
  clearNode(list);

  const tasks = state.tasks.filter((task) => task.status === statusKey);
  if (tasks.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'No hay tareas en esta columna.';
    list.appendChild(empty);
    return;
  }

  tasks.forEach((task) => {
    list.appendChild(createTaskCard(task));
  });
};

const renderBoard = () => {
  renderColumn('todo');
  renderColumn('doing');
  renderColumn('done');
  updateSummary();
};

if (taskForm) {
  taskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const owner = ownerInput.value.trim();
    const due = dueInput.value;
    const priority = priorityInput.value;

    if (!title || !owner || !due || !priority) {
      if (formFeedback) {
        formFeedback.textContent = 'Completa todos los campos para crear la tarea.';
      }
      return;
    }

    if (formFeedback) {
      formFeedback.textContent = '';
    }

    state.tasks.unshift({
      id: crypto.randomUUID(),
      title,
      owner,
      due,
      priority,
      status: 'todo'
    });

    taskForm.reset();
    priorityInput.value = 'Alta';
    renderBoard();
    titleInput.focus();
  });
}

if (focusTopButton) {
  focusTopButton.addEventListener('click', () => {
    titleInput.focus();
  });
}

renderBoard();
