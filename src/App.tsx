import { type FormEvent, useState } from 'react'
import './App.css'
import {
  financeGoal,
  planningHierarchy,
  productivityStats,
  tasks,
  timeline,
  visionBoard,
  weekCalendar,
} from './data/mockData'
import type { TaskItem } from './types'

type View = 'Dashboard' | 'Planificación' | 'Ejecución' | 'Insights' | 'Vision'
type Timeframe = keyof typeof productivityStats

const views: View[] = ['Dashboard', 'Planificación', 'Ejecución', 'Insights', 'Vision']

function currency(value: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function App() {
  const [activeView, setActiveView] = useState<View>('Dashboard')
  const [isDark, setIsDark] = useState(true)
  const [timeframe, setTimeframe] = useState<Timeframe>('Semana')
  const [taskItems, setTaskItems] = useState<TaskItem[]>(tasks)
  const [taskForm, setTaskForm] = useState({
    title: '',
    category: 'Tarea' as TaskItem['category'],
    due: '',
    priority: 'Media' as TaskItem['priority'],
  })
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

  const completedTasks = taskItems.filter((task) => task.done).length
  const financeProgress = Math.round((financeGoal.current / financeGoal.target) * 100)

  const resetTaskForm = () => {
    setTaskForm({ title: '', category: 'Tarea', due: '', priority: 'Media' })
    setEditingTaskId(null)
  }

  const handleTaskSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cleanTitle = taskForm.title.trim()
    if (!cleanTitle) return

    if (editingTaskId) {
      setTaskItems((prev) =>
        prev.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                title: cleanTitle,
                category: taskForm.category,
                due: taskForm.due.trim() || 'Sin fecha',
                priority: taskForm.priority,
              }
            : task,
        ),
      )
      resetTaskForm()
      return
    }

    setTaskItems((prev) => [
      {
        id: `t-${Date.now()}`,
        title: cleanTitle,
        category: taskForm.category,
        due: taskForm.due.trim() || 'Sin fecha',
        priority: taskForm.priority,
        done: false,
      },
      ...prev,
    ])
    resetTaskForm()
  }

  const toggleTask = (taskId: string) => {
    setTaskItems((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)),
    )
  }

  const removeTask = (taskId: string) => {
    setTaskItems((prev) => prev.filter((task) => task.id !== taskId))
    if (editingTaskId === taskId) resetTaskForm()
  }

  const editTask = (task: TaskItem) => {
    setEditingTaskId(task.id)
    setTaskForm({
      title: task.title,
      category: task.category,
      due: task.due,
      priority: task.priority,
    })
  }

  return (
    <div className={`momentum-app ${isDark ? 'theme-dark' : 'theme-light'}`}>
      <header className="topbar card">
        <div>
          <p className="eyebrow">Momentum</p>
          <h1>Productividad premium, mobile-first</h1>
          <p className="subtitle">Planea, ejecuta y mide tu progreso diario a anual en un solo sistema.</p>
        </div>
        <button className="ghost-button" type="button" onClick={() => setIsDark((value) => !value)}>
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </header>

      <nav className="nav-tabs card" aria-label="Navegación principal">
        {views.map((view) => (
          <button
            key={view}
            className={`tab-button ${activeView === view ? 'active' : ''}`}
            onClick={() => setActiveView(view)}
            type="button"
          >
            {view}
          </button>
        ))}
      </nav>

      <main className="content-grid">
        {(activeView === 'Dashboard' || activeView === 'Insights') && (
          <section className="card stat-grid" aria-label="Resumen de rendimiento">
            <article>
              <p>Tareas completadas</p>
              <strong>
                {completedTasks}/{taskItems.length}
              </strong>
            </article>
            <article>
              <p>Consistencia semanal</p>
              <strong>83%</strong>
            </article>
            <article>
              <p>Progreso anual</p>
              <strong>46%</strong>
            </article>
          </section>
        )}

        {(activeView === 'Dashboard' || activeView === 'Planificación') && (
          <section className="card">
            <div className="section-header">
              <h2>Jerarquía de planificación</h2>
              <span>Año → Trimestre → Mes → Semana → Día</span>
            </div>
            <div className="stack-list">
              {planningHierarchy.map((item) => (
                <article key={item.level} className="stack-item">
                  <div className="stack-head">
                    <p>{item.level}</p>
                    <strong>{item.progress}%</strong>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                  <div className="progress-track" role="progressbar" aria-valuenow={item.progress} aria-valuemin={0} aria-valuemax={100}>
                    <div style={{ width: `${item.progress}%` }} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {(activeView === 'Dashboard' || activeView === 'Ejecución') && (
          <section className="card">
            <div className="section-header">
              <h2>Tareas, hábitos, proyectos y metas</h2>
              <span>Vista de ejecución diaria</span>
            </div>
            <form className="task-form" onSubmit={handleTaskSubmit}>
              <input
                value={taskForm.title}
                onChange={(event) =>
                  setTaskForm((prev) => ({ ...prev, title: event.target.value }))
                }
                type="text"
                placeholder="Agregar tarea del planner"
                aria-label="Título de tarea"
              />
              <input
                value={taskForm.due}
                onChange={(event) =>
                  setTaskForm((prev) => ({ ...prev, due: event.target.value }))
                }
                type="text"
                placeholder="Fecha u hora objetivo"
                aria-label="Fecha de tarea"
              />
              <select
                value={taskForm.category}
                onChange={(event) =>
                  setTaskForm((prev) => ({
                    ...prev,
                    category: event.target.value as TaskItem['category'],
                  }))
                }
                aria-label="Categoría de tarea"
              >
                <option value="Tarea">Tarea</option>
                <option value="Hábito">Hábito</option>
                <option value="Proyecto">Proyecto</option>
                <option value="Meta">Meta</option>
              </select>
              <select
                value={taskForm.priority}
                onChange={(event) =>
                  setTaskForm((prev) => ({
                    ...prev,
                    priority: event.target.value as TaskItem['priority'],
                  }))
                }
                aria-label="Prioridad de tarea"
              >
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
              <button type="submit" className="primary-button">
                {editingTaskId ? 'Guardar' : 'Agregar +'}
              </button>
              {editingTaskId && (
                <button type="button" className="ghost-button" onClick={resetTaskForm}>
                  Cancelar
                </button>
              )}
            </form>
            <div className="task-list">
              {taskItems.map((task) => (
                <article key={task.id} className={`task-item ${task.done ? 'is-done' : ''}`}>
                  <label className="task-check">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleTask(task.id)}
                      aria-label={`Marcar ${task.title}`}
                    />
                  </label>
                  <div className="task-content">
                    <p className="task-meta">
                      {task.category} · {task.priority}
                    </p>
                    <h3>{task.title}</h3>
                    <p>{task.due}</p>
                  </div>
                  <div className="task-actions">
                    <span className={`pill ${task.done ? 'done' : 'pending'}`}>
                      {task.done ? 'Hecho' : 'Pendiente'}
                    </span>
                    <button type="button" className="task-action" onClick={() => editTask(task)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className="task-action danger"
                      onClick={() => removeTask(task.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <div className="calendar-row" aria-label="Calendario semanal">
              {weekCalendar.map((item) => (
                <div key={item.day} className={`calendar-item ${item.state}`}>
                  <span>{item.day}</span>
                  <strong>{item.date}</strong>
                </div>
              ))}
            </div>
          </section>
        )}

        {(activeView === 'Dashboard' || activeView === 'Insights') && (
          <section className="card">
            <div className="section-header inline">
              <h2>Estadísticas y progreso</h2>
              <div className="chips" role="tablist" aria-label="Rango temporal">
                {(Object.keys(productivityStats) as Timeframe[]).map((range) => (
                  <button
                    key={range}
                    className={`chip ${timeframe === range ? 'active' : ''}`}
                    onClick={() => setTimeframe(range)}
                    type="button"
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div className="bars" aria-label="Gráfica de productividad">
              {productivityStats[timeframe].map((point) => (
                <article key={point.label}>
                  <div className="bar-shell">
                    <div className="bar-fill" style={{ height: `${point.value}%` }} />
                  </div>
                  <p>{point.label}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {(activeView === 'Dashboard' || activeView === 'Ejecución') && (
          <section className="card finance-card">
            <div>
              <p className="eyebrow">Objetivo financiero</p>
              <h2>{financeGoal.label}</h2>
              <p>
                {currency(financeGoal.current)} / {currency(financeGoal.target)} · meta {financeGoal.targetDate}
              </p>
            </div>
            <div className="ring" style={{ ['--value' as string]: `${financeProgress}%` }}>
              <strong>{financeProgress}%</strong>
            </div>
            <div className="finance-footer">
              <p>Ahorro sugerido mensual</p>
              <strong>{currency(financeGoal.monthlyNeeded)}</strong>
            </div>
          </section>
        )}

        {(activeView === 'Dashboard' || activeView === 'Ejecución') && (
          <section className="card">
            <div className="section-header">
              <h2>Timeline de progreso con evidencias</h2>
              <span>Feed visual y trazable</span>
            </div>
            <div className="timeline">
              {timeline.map((entry) => (
                <article key={entry.id} className="timeline-item">
                  <div className="evidence-image">{entry.evidence}</div>
                  <div>
                    <h3>{entry.title}</h3>
                    <p className="task-meta">{entry.time}</p>
                    <p>{entry.note}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {(activeView === 'Dashboard' || activeView === 'Vision') && (
          <section className="card focus-vision">
            <article className="focus-block">
              <div className="section-header">
                <h2>Modo enfoque</h2>
                <span>Sesión actual</span>
              </div>
              <p className="focus-time">48:20</p>
              <p>Bloque activo: Diseño de experiencia mobile-first para Momentum.</p>
              <button type="button" className="primary-button">
                Iniciar bloque profundo
              </button>
            </article>
            <article>
              <div className="section-header">
                <h2>Vision board</h2>
                <span>Dirección estratégica</span>
              </div>
              <div className="vision-grid">
                {visionBoard.map((item) => (
                  <div key={item.id} className="vision-item">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
