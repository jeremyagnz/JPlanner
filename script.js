const taskForm = document.getElementById('taskForm');
const titleInput = document.getElementById('taskTitle');
const ownerInput = document.getElementById('taskOwner');
const dueInput = document.getElementById('taskDue');
const priorityInput = document.getElementById('taskPriority'); // hidden input
const descInput = document.getElementById('taskDesc');
const priorityPicker = document.getElementById('priorityPicker');
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
      status: 'todo',
      desc: 'Incluir pantallas de bienvenida y tutorial inicial.'
    },
    {
      id: crypto.randomUUID(),
      title: 'Configurar reportes semanales',
      owner: 'Miguel',
      due: '2026-06-12',
      priority: 'Media',
      status: 'doing',
      desc: ''
    },
    {
      id: crypto.randomUUID(),
      title: 'Publicar guía de procesos',
      owner: 'Luisa',
      due: '2026-06-05',
      priority: 'Baja',
      status: 'done',
      desc: ''
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

// drag state – declared early so createTaskCard can reference it
let draggedId = null;

const avatarPalette = [
  ['#7c3aed', '#3b82f6'],
  ['#db2777', '#7c3aed'],
  ['#059669', '#3b82f6'],
  ['#d97706', '#db2777'],
  ['#2563eb', '#059669']
];

const getAvatarColors = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = Math.imul(31, hash) + name.charCodeAt(i) | 0;
  }
  return avatarPalette[Math.abs(hash) % avatarPalette.length];
};

const getInitials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w[0] || '')
    .join('')
    .toUpperCase()
    .slice(0, 2);

const createTaskCard = (task) => {
  const card = document.createElement('article');
  card.className = 'task-card';
  card.draggable = true;

  // Drag events
  card.addEventListener('dragstart', (e) => {
    draggedId = task.id;
    e.dataTransfer.effectAllowed = 'move';
    requestAnimationFrame(() => card.classList.add('dragging'));
  });
  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
    draggedId = null;
    document.querySelectorAll('.task-list').forEach((l) => l.classList.remove('drag-over'));
  });

  // Header: avatar + title
  const header = document.createElement('div');
  header.className = 'card-header';

  const avatar = document.createElement('div');
  avatar.className = 'card-avatar';
  avatar.textContent = getInitials(task.owner);
  const [c1, c2] = getAvatarColors(task.owner);
  avatar.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;

  const title = document.createElement('h3');
  title.textContent = task.title;

  header.append(avatar, title);

  // Optional description
  const descEl = task.desc
    ? (() => {
        const p = document.createElement('p');
        p.className = 'meta';
        p.style.cssText = 'font-size:0.74rem;line-height:1.55;margin-top:0.18rem;opacity:0.72;';
        p.textContent = task.desc.length > 90 ? task.desc.slice(0, 90) + '…' : task.desc;
        return p;
      })()
    : null;

  // Meta info
  const meta = document.createElement('p');
  meta.className = 'meta';
  meta.textContent = `${task.owner}  ·  ${formatDate(task.due)}`;

  // Bottom row: priority badge + actions
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
  moveButton.textContent = `→ ${statusLabels[next]}`;
  moveButton.addEventListener('click', () => {
    task.status = nextStatus(task.status);
    renderBoard();
  });

  const deleteButton = document.createElement('button');
  deleteButton.className = 'btn danger';
  deleteButton.type = 'button';
  deleteButton.textContent = '✕';
  deleteButton.setAttribute('aria-label', 'Eliminar tarea');
  deleteButton.addEventListener('click', () => {
    state.tasks = state.tasks.filter((item) => item.id !== task.id);
    renderBoard();
  });

  actions.append(moveButton, deleteButton);
  row.append(priority, actions);

  const children = [header];
  if (descEl) children.push(descEl);
  children.push(meta, row);
  card.append(...children);

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
  updateCharts();
};

// ─── PRIORITY PICKER ───
const resetPriorityPicker = () => {
  if (!priorityPicker) return;
  priorityPicker.querySelectorAll('.prio-btn').forEach((b) => b.classList.remove('active'));
  const defaultBtn = priorityPicker.querySelector('[data-value="Alta"]');
  if (defaultBtn) defaultBtn.classList.add('active');
  if (priorityInput) priorityInput.value = 'Alta';
};

if (priorityPicker) {
  priorityPicker.querySelectorAll('.prio-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      priorityPicker.querySelectorAll('.prio-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      if (priorityInput) priorityInput.value = btn.dataset.value;
    });
  });
}

// ─── FORM SUBMIT ───
if (taskForm) {
  taskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const owner = ownerInput.value.trim();
    const due = dueInput.value;
    const priority = priorityInput ? priorityInput.value : 'Alta';
    const desc = descInput ? descInput.value.trim() : '';

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
      desc,
      status: 'todo'
    });

    taskForm.reset();
    resetPriorityPicker();
    renderBoard();
    titleInput.focus();
  });
}

if (focusTopButton) {
  focusTopButton.addEventListener('click', () => {
    titleInput.focus();
    titleInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

// ─── DRAG AND DROP ───
const initDragAndDrop = () => {
  Object.entries(lists).forEach(([status, list]) => {
    list.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      list.classList.add('drag-over');
    });

    list.addEventListener('dragleave', (e) => {
      if (!list.contains(e.relatedTarget)) {
        list.classList.remove('drag-over');
      }
    });

    list.addEventListener('drop', (e) => {
      e.preventDefault();
      list.classList.remove('drag-over');
      if (!draggedId) return;
      const task = state.tasks.find((t) => t.id === draggedId);
      if (task && task.status !== status) {
        task.status = status;
        renderBoard();
      }
      draggedId = null;
    });
  });
};

initDragAndDrop();

// ─── CHARTS ───
let statusChartInst = null;
let priorityChartInst = null;

const initCharts = () => {
  if (typeof Chart === 'undefined') return;

  Chart.defaults.color = 'rgba(232, 236, 255, 0.48)';
  Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.06)';

  const statusCtx = document.getElementById('statusChart');
  const priorityCtx = document.getElementById('priorityChart');

  if (statusCtx) {
    statusChartInst = new Chart(statusCtx, {
      type: 'doughnut',
      data: {
        labels: ['Pendiente', 'En progreso', 'Completado'],
        datasets: [
          {
            data: [0, 0, 0],
            backgroundColor: [
              'rgba(96, 165, 250, 0.7)',
              'rgba(245, 158, 11, 0.7)',
              'rgba(52, 211, 153, 0.7)'
            ],
            borderColor: ['rgba(96, 165, 250, 1)', 'rgba(245, 158, 11, 1)', 'rgba(52, 211, 153, 1)'],
            borderWidth: 1.5,
            hoverOffset: 8
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'rgba(232, 236, 255, 0.55)',
              boxWidth: 11,
              padding: 18,
              font: { size: 12 }
            }
          }
        },
        animation: { duration: 500 }
      }
    });
  }

  if (priorityCtx) {
    priorityChartInst = new Chart(priorityCtx, {
      type: 'bar',
      data: {
        labels: ['Alta', 'Media', 'Baja'],
        datasets: [
          {
            label: 'Tareas',
            data: [0, 0, 0],
            backgroundColor: [
              'rgba(239, 68, 68, 0.45)',
              'rgba(245, 158, 11, 0.45)',
              'rgba(16, 185, 129, 0.45)'
            ],
            borderColor: [
              'rgba(239, 68, 68, 0.9)',
              'rgba(245, 158, 11, 0.9)',
              'rgba(16, 185, 129, 0.9)'
            ],
            borderWidth: 1.5,
            borderRadius: 8,
            borderSkipped: false
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: 'rgba(232, 236, 255, 0.4)', stepSize: 1 },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          },
          x: {
            ticks: { color: 'rgba(232, 236, 255, 0.55)', font: { weight: '600' } },
            grid: { display: false }
          }
        },
        animation: { duration: 500 }
      }
    });
  }
};

const updateCharts = () => {
  if (statusChartInst) {
    statusChartInst.data.datasets[0].data = [
      state.tasks.filter((t) => t.status === 'todo').length,
      state.tasks.filter((t) => t.status === 'doing').length,
      state.tasks.filter((t) => t.status === 'done').length
    ];
    statusChartInst.update();
  }

  if (priorityChartInst) {
    priorityChartInst.data.datasets[0].data = [
      state.tasks.filter((t) => t.priority === 'Alta').length,
      state.tasks.filter((t) => t.priority === 'Media').length,
      state.tasks.filter((t) => t.priority === 'Baja').length
    ];
    priorityChartInst.update();
  }
};

initCharts();
renderBoard();
