export type PlanningNode = {
  level: 'Año' | 'Trimestre' | 'Mes' | 'Semana' | 'Día'
  title: string
  progress: number
  detail: string
}

export type TaskItem = {
  id: string
  title: string
  category: 'Tarea' | 'Hábito' | 'Proyecto' | 'Meta'
  due: string
  done: boolean
  priority: 'Alta' | 'Media' | 'Baja'
}

export type FinanceGoal = {
  label: string
  current: number
  target: number
  targetDate: string
  monthlyNeeded: number
}

export type TimelineEntry = {
  id: string
  title: string
  time: string
  note: string
  evidence: string
}

export type VisionItem = {
  id: string
  title: string
  description: string
}

export type StatPoint = {
  label: string
  value: number
}
