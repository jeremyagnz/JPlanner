import type {
  FinanceGoal,
  PlanningNode,
  StatPoint,
  TaskItem,
  TimelineEntry,
  VisionItem,
} from '../types'

export const planningHierarchy: PlanningNode[] = [
  {
    level: 'Año',
    title: '2026 · Año de tracción sostenible',
    progress: 46,
    detail: 'Meta principal: duplicar ingresos y mantener consistencia de hábitos.',
  },
  {
    level: 'Trimestre',
    title: 'Q3 · Escalar producto y marca personal',
    progress: 52,
    detail: 'Lanzar 2 iteraciones clave y cerrar 3 alianzas estratégicas.',
  },
  {
    level: 'Mes',
    title: 'Junio · Sistema + ejecución diaria',
    progress: 61,
    detail: 'Consolidar rutina de trabajo profundo y entregas semanales.',
  },
  {
    level: 'Semana',
    title: 'Semana 23 · Enfoque en Momentum',
    progress: 67,
    detail: 'Completar dashboard premium, métricas y onboarding narrativo.',
  },
  {
    level: 'Día',
    title: 'Hoy · Sprint de producto',
    progress: 72,
    detail: 'Finalizar vista principal, validar UX móvil y preparar siguiente release.',
  },
]

export const tasks: TaskItem[] = [
  {
    id: 't1',
    title: 'Refinar flujo de planificación semanal',
    category: 'Proyecto',
    due: 'Hoy · 18:00',
    done: false,
    priority: 'Alta',
  },
  {
    id: 't2',
    title: 'Entrenamiento y lectura 30 min',
    category: 'Hábito',
    due: 'Diario · 07:00',
    done: true,
    priority: 'Media',
  },
  {
    id: 't3',
    title: 'Actualizar KPI de crecimiento',
    category: 'Meta',
    due: 'Mañana · 10:00',
    done: false,
    priority: 'Alta',
  },
  {
    id: 't4',
    title: 'Revisión de diseño mobile-first',
    category: 'Tarea',
    due: 'Hoy · 16:30',
    done: true,
    priority: 'Baja',
  },
]

export const financeGoal: FinanceGoal = {
  label: 'Fondo de libertad financiera',
  current: 13850,
  target: 25000,
  targetDate: '2026-12-31',
  monthlyNeeded: 1591,
}

export const productivityStats: Record<'Semana' | 'Mes' | 'Trimestre', StatPoint[]> = {
  Semana: [
    { label: 'Lun', value: 68 },
    { label: 'Mar', value: 82 },
    { label: 'Mié', value: 77 },
    { label: 'Jue', value: 91 },
    { label: 'Vie', value: 73 },
    { label: 'Sáb', value: 52 },
    { label: 'Dom', value: 64 },
  ],
  Mes: [
    { label: 'S1', value: 63 },
    { label: 'S2', value: 71 },
    { label: 'S3', value: 69 },
    { label: 'S4', value: 76 },
  ],
  Trimestre: [
    { label: 'Abr', value: 58 },
    { label: 'May', value: 66 },
    { label: 'Jun', value: 74 },
  ],
}

export const timeline: TimelineEntry[] = [
  {
    id: 'e1',
    title: 'Semana cerrada con 18 tareas completadas',
    time: 'Hace 2 horas',
    note: 'Mejor consistencia del trimestre. Evidencia de tablero y resumen de avance.',
    evidence: 'Sprint Board',
  },
  {
    id: 'e2',
    title: 'Hábito de enfoque completado 7/7 días',
    time: 'Ayer',
    note: 'Bloques de 90 minutos sin interrupciones para trabajo profundo.',
    evidence: 'Focus Session',
  },
  {
    id: 'e3',
    title: 'Ahorro mensual alcanzó +$1,900',
    time: 'Hace 3 días',
    note: 'Se superó el objetivo mensual de ahorro para la meta anual.',
    evidence: 'Finance Snapshot',
  },
]

export const visionBoard: VisionItem[] = [
  {
    id: 'v1',
    title: 'Producto global',
    description: 'Lanzar Momentum en móvil y web con 50k usuarios activos.',
  },
  {
    id: 'v2',
    title: 'Salud y energía',
    description: 'Entrenar 5 días por semana y mantener sueño de alta calidad.',
  },
  {
    id: 'v3',
    title: 'Libertad financiera',
    description: 'Construir reservas para operar con tranquilidad y visión de largo plazo.',
  },
]

export const weekCalendar = [
  { day: 'L', date: 3, state: 'done' },
  { day: 'M', date: 4, state: 'done' },
  { day: 'X', date: 5, state: 'today' },
  { day: 'J', date: 6, state: 'upcoming' },
  { day: 'V', date: 7, state: 'upcoming' },
  { day: 'S', date: 8, state: 'upcoming' },
  { day: 'D', date: 9, state: 'upcoming' },
] as const
