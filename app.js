const tabs = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'quarterly', label: 'Quarterly' },
  { id: 'yearly', label: 'Yearly' },
  { id: 'breakdown', label: 'Goal Breakdown' },
  { id: 'life', label: 'Life Dashboard' },
  { id: 'vision', label: 'Vision Board' },
  { id: 'smart', label: 'Smart Planning' },
  { id: 'hierarchy', label: 'Hierarchy' }
];

const model = {
  yearlyGoal: {
    id: 'goal-year-2026',
    title: 'Ahorrar $25,000',
    target: 25000,
    current: 11250,
    deadline: '2026-12-31',
    yearlyRoadmap: ['Q1 presupuesto', 'Q2 disciplina', 'Q3 impulso', 'Q4 cierre'],
    achievements: ['✅ Comprar vehículo', '⏳ Ahorrar $25,000', '⏳ Aprender inglés', '✅ Crear aplicación SaaS']
  },
  quarter: {
    id: 'q3-2026',
    label: 'Q3 2026',
    objective: 'Ahorrar $25,000',
    keyResults: [
      { label: 'Alcanzar $10,000 en agosto', target: 10000, current: 10000 },
      { label: 'Alcanzar $18,000 en octubre', target: 18000, current: 13000 },
      { label: 'Alcanzar $25,000 en diciembre', target: 25000, current: 11250 }
    ],
    financialGoals: ['Reducir gastos variables 20%', 'Incrementar ingresos freelance'],
    personalGoals: ['Rutina de salud estable', 'Mejorar nivel de inglés']
  },
  monthly: {
    month: '2026-06',
    previousMonthCompletion: 58,
    currentCompletion: 64,
    goals: ['Ahorrar $2,083', 'Cerrar 2 proyectos freelance'],
    milestones: ['Hito 1: $12,000 acumulados', 'Hito 2: plan de inversión'],
    importantEvents: ['15/06 Pago renta', '28/06 revisión mensual']
  },
  weekly: {
    goals: ['Depositar $481', 'Completar 5 sesiones de inglés'],
    estimatedHours: 24,
    review: {
      achieved: '',
      pending: '',
      improve: ''
    }
  },
  day: {
    date: new Date().toISOString().slice(0, 10),
    agenda: ['07:30 Gimnasio', '09:00 Trabajo profundo', '18:00 Revisión diaria'],
    objectives: ['Depositar $70', 'Avanzar curso de inglés'],
    priorities: ['Finanzas', 'Salud', 'Carrera'],
    habits: ['Agua 2L', 'Lectura 20 min', 'Meditación 10 min'],
    reminders: ['Pagar tarjeta', 'Enviar factura'],
    events: ['Llamada con cliente 14:00', 'Clase de inglés 20:00'],
    tasks: [
      { id: 't1', text: 'Transferir $70 a ahorro', done: true, contribution: 'Week Goal: Ahorrar $481' },
      { id: 't2', text: 'Registrar gastos del día', done: false, contribution: 'Month Goal: Ahorrar $2,083' },
      { id: 't3', text: 'Lección de inglés 30 min', done: false, contribution: 'Year Goal: Aprender inglés' }
    ]
  },
  weekTasksByDay: {
    Lunes: ['Transferencia ahorro', 'Trabajo profundo'],
    Martes: ['Llamadas de ventas', 'Rutina saludable'],
    Miércoles: ['Estudio inglés', 'Seguimiento de gastos'],
    Jueves: ['Bloque de proyecto', 'Entrenamiento'],
    Viernes: ['Weekly Review', 'Planificar semana siguiente'],
    Sábado: ['Tiempo familia'],
    Domingo: ['Plan mensual y descanso']
  },
  lifeAreas: {
    Finanzas: 68,
    Salud: 62,
    Carrera: 74,
    Estudios: 59,
    Relaciones: 65,
    Proyectos: 71
  },
  visionBoard: [],
  smartSuggestions: []
};

const state = {
  activeTab: 'daily',
  focusMode: false,
  draggingTaskId: null
};

const reviewStoreKey = 'jplanner-weekly-review';
const visionStoreKey = 'jplanner-vision-board';

init();

function init() {
  buildTabs();
  loadStoredData();
  renderAll();
  wireEvents();
}

function buildTabs() {
  const nav = document.getElementById('tabs');
  nav.innerHTML = tabs
    .map((tab) => `<button data-tab="${tab.id}" class="${tab.id === state.activeTab ? 'active' : ''}">${tab.label}</button>`)
    .join('');
}

function loadStoredData() {
  const storedReview = localStorage.getItem(reviewStoreKey);
  if (storedReview) {
    model.weekly.review = JSON.parse(storedReview);
  }

  const storedVision = localStorage.getItem(visionStoreKey);
  if (storedVision) {
    model.visionBoard = JSON.parse(storedVision);
  }
}

function wireEvents() {
  document.getElementById('tabs').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-tab]');
    if (!button || state.focusMode) return;
    switchTab(button.dataset.tab);
  });

  document.getElementById('focusToggle').addEventListener('click', () => {
    state.focusMode = !state.focusMode;
    document.body.classList.toggle('focus-enabled', state.focusMode);
    document.getElementById('focusToggle').textContent = state.focusMode ? 'Desactivar Focus Mode' : 'Activar Focus Mode';
    if (state.focusMode) switchTab('daily');
  });
}

function switchTab(tabId) {
  state.activeTab = tabId;
  for (const tab of tabs) {
    const element = document.getElementById(tab.id);
    element.classList.toggle('hidden', tab.id !== tabId);
  }
  document.querySelectorAll('#tabs button').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
}

function renderAll() {
  renderDaily();
  renderWeekly();
  renderMonthly();
  renderQuarterly();
  renderYearly();
  renderBreakdown();
  renderLife();
  renderVision();
  renderSmart();
  renderHierarchy();
}

function renderDaily() {
  const doneCount = model.day.tasks.filter((task) => task.done).length;
  const progress = Math.round((doneCount / model.day.tasks.length) * 100);

  document.getElementById('daily').innerHTML = `
    <h2>Daily Planner · ${model.day.date}</h2>
    <div class="card focus-only">
      <h3>Focus Mode</h3>
      <p>Solo objetivos, tareas y progreso actual.</p>
    </div>
    <div class="grid">
      <div class="card">
        <h3>Agenda del día</h3>
        <ul class="list">${model.day.agenda.map((item) => `<li>${item}</li>`).join('')}</ul>
      </div>
      <div class="card">
        <h3>Objetivos del día</h3>
        <ul class="list">${model.day.objectives.map((item) => `<li>${item}</li>`).join('')}</ul>
      </div>
      <div class="card">
        <h3>Prioridades</h3>
        <ul class="list">${model.day.priorities.map((item) => `<li><span class="tag">${item}</span></li>`).join('')}</ul>
      </div>
      <div class="card">
        <h3>Hábitos</h3>
        <ul class="list">${model.day.habits.map((item) => `<li>${item}</li>`).join('')}</ul>
      </div>
      <div class="card">
        <h3>Recordatorios</h3>
        <ul class="list">${model.day.reminders.map((item) => `<li>${item}</li>`).join('')}</ul>
      </div>
      <div class="card">
        <h3>Eventos</h3>
        <ul class="list">${model.day.events.map((item) => `<li>${item}</li>`).join('')}</ul>
      </div>
      <div class="card">
        <h3>Tareas pendientes (drag & drop)</h3>
        <div id="taskList">${model.day.tasks.map((task) => renderTaskItem(task)).join('')}</div>
        <div class="progress-wrap">
          <small>Progreso diario: ${progress}%</small>
          <progress max="100" value="${progress}"></progress>
        </div>
      </div>
    </div>
  `;

  const taskList = document.getElementById('taskList');
  taskList.querySelectorAll('.task-item').forEach((item) => {
    item.addEventListener('dragstart', onDragStart);
    item.addEventListener('dragover', onDragOver);
    item.addEventListener('drop', onDrop);
    item.addEventListener('dragend', onDragEnd);
  });
}

function renderTaskItem(task) {
  const checked = task.done ? 'checked' : '';
  return `
    <div class="task-item" draggable="true" data-task-id="${task.id}">
      <label><input type="checkbox" data-toggle-task="${task.id}" ${checked}> ${task.text}</label>
      <small>${task.contribution}</small>
    </div>
  `;
}

function onDragStart(event) {
  const item = event.currentTarget;
  state.draggingTaskId = item.dataset.taskId;
  item.classList.add('dragging');
}

function onDragOver(event) {
  event.preventDefault();
}

function onDrop(event) {
  event.preventDefault();
  const targetId = event.currentTarget.dataset.taskId;
  if (!state.draggingTaskId || state.draggingTaskId === targetId) return;

  const fromIndex = model.day.tasks.findIndex((task) => task.id === state.draggingTaskId);
  const toIndex = model.day.tasks.findIndex((task) => task.id === targetId);
  const [moved] = model.day.tasks.splice(fromIndex, 1);
  model.day.tasks.splice(toIndex, 0, moved);
  renderDaily();
  attachTaskCheckboxEvents();
}

function onDragEnd(event) {
  event.currentTarget.classList.remove('dragging');
  state.draggingTaskId = null;
}

function attachTaskCheckboxEvents() {
  document.querySelectorAll('input[data-toggle-task]').forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      const taskId = event.target.dataset.toggleTask;
      const task = model.day.tasks.find((item) => item.id === taskId);
      task.done = event.target.checked;
      renderDaily();
      attachTaskCheckboxEvents();
      renderWeekly();
      renderMonthly();
      renderYearly();
      renderBreakdown();
      renderHierarchy();
    });
  });
}

function renderWeekly() {
  const doneTasks = model.day.tasks.filter((task) => task.done).length;
  const weekCompletion = Math.min(100, Math.round((doneTasks / (model.day.tasks.length + model.weekly.goals.length)) * 100) * 2);

  document.getElementById('weekly').innerHTML = `
    <h2>Weekly Planner</h2>
    <div class="grid">
      <div class="card">
        <h3>Objetivos de la semana</h3>
        <ul class="list">${model.weekly.goals.map((goal) => `<li>${goal}</li>`).join('')}</ul>
        <p>Tiempo estimado semanal: <strong>${model.weekly.estimatedHours}h</strong></p>
        <p>Porcentaje de cumplimiento: <strong>${weekCompletion}%</strong></p>
        <progress max="100" value="${weekCompletion}"></progress>
      </div>
      <div class="card">
        <h3>Tareas por día</h3>
        ${Object.entries(model.weekTasksByDay)
          .map(([day, tasks]) => `<p><strong>${day}:</strong> ${tasks.join(', ')}</p>`)
          .join('')}
      </div>
      <div class="card">
        <h3>Weekly Review</h3>
        <label>¿Qué logré?<textarea id="reviewAchieved">${escapeHtml(model.weekly.review.achieved)}</textarea></label>
        <label>¿Qué quedó pendiente?<textarea id="reviewPending">${escapeHtml(model.weekly.review.pending)}</textarea></label>
        <label>¿Qué mejoraré la próxima semana?<textarea id="reviewImprove">${escapeHtml(model.weekly.review.improve)}</textarea></label>
        <button class="btn" id="saveReview">Guardar review</button>
      </div>
    </div>
  `;

  document.getElementById('saveReview').addEventListener('click', () => {
    model.weekly.review.achieved = document.getElementById('reviewAchieved').value;
    model.weekly.review.pending = document.getElementById('reviewPending').value;
    model.weekly.review.improve = document.getElementById('reviewImprove').value;
    localStorage.setItem(reviewStoreKey, JSON.stringify(model.weekly.review));
  });
}

function renderMonthly() {
  const calendar = renderMonthCalendar();
  const compared = model.monthly.currentCompletion - model.monthly.previousMonthCompletion;
  const comparedText = compared >= 0 ? `+${compared}% vs mes anterior` : `${compared}% vs mes anterior`;

  document.getElementById('monthly').innerHTML = `
    <h2>Monthly Planner · ${model.monthly.month}</h2>
    <div class="grid">
      <div class="card">
        <h3>Calendario del mes</h3>
        <div class="calendar">${calendar}</div>
      </div>
      <div class="card">
        <h3>Metas e hitos</h3>
        <h4>Metas del mes</h4>
        <ul class="list">${model.monthly.goals.map((goal) => `<li>${goal}</li>`).join('')}</ul>
        <h4>Hitos importantes</h4>
        <ul class="list">${model.monthly.milestones.map((item) => `<li>${item}</li>`).join('')}</ul>
        <h4>Eventos importantes</h4>
        <ul class="list">${model.monthly.importantEvents.map((item) => `<li>${item}</li>`).join('')}</ul>
      </div>
      <div class="card">
        <h3>Estadísticas mensuales</h3>
        <p class="kpi">${model.monthly.currentCompletion}%</p>
        <p>${comparedText}</p>
        <progress max="100" value="${model.monthly.currentCompletion}"></progress>
      </div>
    </div>
  `;
}

function renderQuarterly() {
  document.getElementById('quarterly').innerHTML = `
    <h2>Quarterly Planner · ${model.quarter.label}</h2>
    <div class="grid">
      <div class="card">
        <h3>Objetivo trimestral</h3>
        <p><strong>${model.quarter.objective}</strong></p>
        <h4>Resultados clave (OKR)</h4>
        ${model.quarter.keyResults
          .map((kr) => {
            const krPct = Math.round((kr.current / kr.target) * 100);
            return `<p>${kr.label}<br><small>${kr.current.toLocaleString()} / ${kr.target.toLocaleString()} (${krPct}%)</small><progress max="100" value="${krPct}"></progress></p>`;
          })
          .join('')}
      </div>
      <div class="card">
        <h3>Metas financieras</h3>
        <ul class="list">${model.quarter.financialGoals.map((goal) => `<li>${goal}</li>`).join('')}</ul>
        <h3>Metas personales</h3>
        <ul class="list">${model.quarter.personalGoals.map((goal) => `<li>${goal}</li>`).join('')}</ul>
      </div>
    </div>
  `;
}

function renderYearly() {
  const yearProgress = Math.round((model.yearlyGoal.current / model.yearlyGoal.target) * 100);

  document.getElementById('yearly').innerHTML = `
    <h2>Yearly Planner · 2026</h2>
    <div class="grid">
      <div class="card">
        <h3>Metas anuales</h3>
        <ul class="list">${model.yearlyGoal.achievements.map((item) => `<li>${item}</li>`).join('')}</ul>
      </div>
      <div class="card">
        <h3>Roadmap del año</h3>
        <ul class="list">${model.yearlyGoal.yearlyRoadmap.map((item) => `<li>${item}</li>`).join('')}</ul>
      </div>
      <div class="card">
        <h3>Progreso anual visual</h3>
        <p class="kpi">${yearProgress}%</p>
        <small>${model.yearlyGoal.current.toLocaleString()} / ${model.yearlyGoal.target.toLocaleString()}</small>
        <progress max="100" value="${yearProgress}"></progress>
      </div>
    </div>
  `;
}

function renderBreakdown() {
  const calculations = getGoalBreakdown(model.yearlyGoal.target, model.yearlyGoal.current);

  document.getElementById('breakdown').innerHTML = `
    <h2>Goal Breakdown System</h2>
    <div class="grid">
      <div class="card">
        <h3>Meta principal</h3>
        <p>${model.yearlyGoal.title} para diciembre</p>
        <p>Faltante total: <strong>$${calculations.remaining.toLocaleString()}</strong></p>
      </div>
      <div class="card">
        <h3>Desglose automático</h3>
        <p>Anual: <strong>$${calculations.annual.toLocaleString()}</strong></p>
        <p>Mensual: <strong>$${calculations.monthly.toLocaleString()}</strong></p>
        <p>Semanal: <strong>$${calculations.weekly.toLocaleString()}</strong></p>
        <p>Diario: <strong>$${calculations.daily.toLocaleString()}</strong></p>
      </div>
      <div class="card">
        <h3>Brecha por nivel</h3>
        ${renderBreakdownBars(calculations)}
      </div>
    </div>
  `;
}

function renderBreakdownBars(calculations) {
  return [
    { label: 'Anual', value: calculations.remaining / calculations.annual },
    { label: 'Mensual', value: calculations.remaining / (calculations.monthly * 12) },
    { label: 'Semanal', value: calculations.remaining / (calculations.weekly * 52) },
    { label: 'Diario', value: calculations.remaining / (calculations.daily * 365) }
  ]
    .map((item) => {
      const pct = Math.min(100, Math.max(0, Math.round((1 - item.value) * 100)));
      return `<p>${item.label}: ${pct}% completado<progress max="100" value="${pct}"></progress></p>`;
    })
    .join('');
}

function renderLife() {
  document.getElementById('life').innerHTML = `
    <h2>Life Dashboard</h2>
    <div class="grid">
      <div class="card">
        <h3>Balance general (Radar)</h3>
        <canvas id="lifeRadar" width="360" height="300"></canvas>
      </div>
      <div class="card">
        <h3>Áreas de vida</h3>
        <ul class="list">${Object.entries(model.lifeAreas)
          .map(([area, score]) => `<li>${area}: <strong>${score}%</strong></li>`)
          .join('')}</ul>
      </div>
    </div>
  `;

  drawRadarChart('lifeRadar', model.lifeAreas);
}

function renderVision() {
  document.getElementById('vision').innerHTML = `
    <h2>Vision Board</h2>
    <div class="grid">
      <div class="card">
        <h3>Agregar imagen</h3>
        <label>Imagen<input type="file" id="visionImage" accept="image/*"></label>
        <label>Objetivo asociado<input type="text" id="visionGoal" placeholder="Ej. Ahorrar $25,000"></label>
        <label>Tarea relacionada<input type="text" id="visionTask" placeholder="Ej. Depositar $70 diario"></label>
        <button class="btn" id="addVisionItem">Agregar a tablero</button>
      </div>
      <div class="card">
        <h3>Tablero</h3>
        <div class="vision-grid" id="visionGrid">
          ${model.visionBoard.map((item) => renderVisionItem(item)).join('') || '<small>No hay imágenes aún.</small>'}
        </div>
      </div>
    </div>
  `;

  document.getElementById('addVisionItem').addEventListener('click', onAddVisionItem);
}

function renderVisionItem(item) {
  return `
    <article class="vision-item">
      <img src="${item.image}" alt="Vision" />
      <p><strong>${escapeHtml(item.goal)}</strong></p>
      <small>${escapeHtml(item.task)}</small>
    </article>
  `;
}

function onAddVisionItem() {
  const imageInput = document.getElementById('visionImage');
  const goal = document.getElementById('visionGoal').value.trim();
  const task = document.getElementById('visionTask').value.trim();
  const file = imageInput.files[0];

  if (!file || !goal || !task) return;

  const reader = new FileReader();
  reader.onload = () => {
    model.visionBoard.unshift({ image: reader.result, goal, task });
    localStorage.setItem(visionStoreKey, JSON.stringify(model.visionBoard));
    renderVision();
  };
  reader.readAsDataURL(file);
}

function renderSmart() {
  const goalTitle = model.yearlyGoal.title;
  model.smartSuggestions = generateSmartSuggestions(goalTitle, model.yearlyGoal.target, model.yearlyGoal.current);

  document.getElementById('smart').innerHTML = `
    <h2>Smart Planning</h2>
    <div class="grid">
      <div class="card">
        <h3>Sugerencias automáticas para: ${goalTitle}</h3>
        <ul class="list">${model.smartSuggestions.map((item) => `<li>${item}</li>`).join('')}</ul>
      </div>
      <div class="card">
        <h3>KPIs por horizonte</h3>
        ${renderKpis()}
      </div>
      <div class="card">
        <h3>Comparativas</h3>
        <p>Mes actual vs anterior: <strong>${model.monthly.currentCompletion}% vs ${model.monthly.previousMonthCompletion}%</strong></p>
        <p>Avance trimestral (KR promedio): <strong>${quarterProgress()}%</strong></p>
        <p>Avance anual: <strong>${Math.round((model.yearlyGoal.current / model.yearlyGoal.target) * 100)}%</strong></p>
      </div>
    </div>
  `;
}

function renderKpis() {
  const dailyDone = Math.round((model.day.tasks.filter((t) => t.done).length / model.day.tasks.length) * 100);
  const weekly = Math.min(100, dailyDone + 20);
  const monthly = model.monthly.currentCompletion;
  const quarterly = quarterProgress();
  const yearly = Math.round((model.yearlyGoal.current / model.yearlyGoal.target) * 100);

  return `
    <p>Daily: <strong>${dailyDone}%</strong></p>
    <p>Weekly: <strong>${weekly}%</strong></p>
    <p>Monthly: <strong>${monthly}%</strong></p>
    <p>Quarterly: <strong>${quarterly}%</strong></p>
    <p>Yearly: <strong>${yearly}%</strong></p>
  `;
}

function renderHierarchy() {
  document.getElementById('hierarchy').innerHTML = `
    <h2>Planning Hierarchy</h2>
    <div class="card">
      <p><strong>Year Goal:</strong> ${model.yearlyGoal.title}</p>
      <p>↓</p>
      <p><strong>Quarter Goal:</strong> ${model.quarter.objective}</p>
      <p>↓</p>
      <p><strong>Month Goal:</strong> ${model.monthly.goals[0]}</p>
      <p>↓</p>
      <p><strong>Week Goal:</strong> ${model.weekly.goals[0]}</p>
      <p>↓</p>
      <p><strong>Daily Tasks:</strong></p>
      <ul class="list">
        ${model.day.tasks.map((task) => `<li>${task.text} — <small>${task.contribution}</small></li>`).join('')}
      </ul>
    </div>
  `;
}

function renderMonthCalendar() {
  const [year, month] = model.monthly.month.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, index) => `<div class="day"><strong>${index + 1}</strong></div>`).join('');
}

function getGoalBreakdown(target, current) {
  return {
    annual: target,
    monthly: Math.round(target / 12),
    weekly: Math.round(target / 52),
    daily: Math.round(target / 365),
    remaining: Math.max(0, target - current)
  };
}

function generateSmartSuggestions(title, target, current) {
  const pending = target - current;
  const monthly = Math.round(pending / 6);
  const weekly = Math.round(monthly / 4.33);
  return [
    `Crear bloque fijo semanal para ${title.toLowerCase()}.`,
    `Dividir el faltante de $${pending.toLocaleString()} en metas mensuales de $${monthly.toLocaleString()}.`,
    `Planificar una tarea recurrente semanal de $${weekly.toLocaleString()} de aporte.`,
    'Agregar hito de revisión cada viernes para ajustar progreso.',
    'Automatizar recordatorio diario con seguimiento de cumplimiento.'
  ];
}

function quarterProgress() {
  const total = model.quarter.keyResults.reduce((sum, item) => sum + item.target, 0);
  const current = model.quarter.keyResults.reduce((sum, item) => sum + item.current, 0);
  return Math.round((current / total) * 100);
}

function drawRadarChart(canvasId, areas) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  const labels = Object.keys(areas);
  const values = Object.values(areas);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 25;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let ring = 1; ring <= 5; ring += 1) {
    const ringRadius = (radius / 5) * ring;
    ctx.beginPath();
    labels.forEach((_, index) => {
      const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
      const x = centerX + Math.cos(angle) * ringRadius;
      const y = centerY + Math.sin(angle) * ringRadius;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = '#dbe2ee';
    ctx.stroke();
  }

  labels.forEach((label, index) => {
    const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#dbe2ee';
    ctx.stroke();

    const textX = centerX + Math.cos(angle) * (radius + 18);
    const textY = centerY + Math.sin(angle) * (radius + 18);
    ctx.fillStyle = '#1b263b';
    ctx.font = '12px sans-serif';
    ctx.fillText(label, textX - 18, textY);
  });

  ctx.beginPath();
  values.forEach((score, index) => {
    const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
    const valueRadius = radius * (score / 100);
    const x = centerX + Math.cos(angle) * valueRadius;
    const y = centerY + Math.sin(angle) * valueRadius;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(37, 99, 235, 0.25)';
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
}

function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

attachTaskCheckboxEvents();
