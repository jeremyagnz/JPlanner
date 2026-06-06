const tasks = [
  { title: 'Migración de clientes', progress: 82 },
  { title: 'Mejoras UX en tablero', progress: 65 },
  { title: 'Automatización de reportes', progress: 48 },
  { title: 'Integración con Slack', progress: 91 }
];

const list = document.getElementById('progress-list');

if (list) {
  tasks.forEach((task) => {
    const row = document.createElement('div');
    row.className = 'task-row';

    const left = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = task.title;

    const bar = document.createElement('div');
    bar.className = 'bar';

    const fill = document.createElement('span');
    fill.style.width = `${task.progress}%`;

    bar.appendChild(fill);
    left.append(title, bar);

    const percent = document.createElement('span');
    percent.textContent = `${task.progress}%`;

    row.append(left, percent);
    list.appendChild(row);
  });
}
