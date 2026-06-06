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
    row.innerHTML = `
      <div>
        <strong>${task.title}</strong>
        <div class="bar"><span style="width: ${task.progress}%"></span></div>
      </div>
      <span>${task.progress}%</span>
    `;
    list.appendChild(row);
  });
}
