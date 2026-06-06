# Momentum (JPlanner)

Momentum es una base **mobile-first** de productividad premium, diseñada para evolucionar hacia apps móvil, web y futuras expansiones.

## Qué incluye esta versión

- Dashboard principal con métricas de productividad
- Planificación jerárquica: **Año → Trimestre → Mes → Semana → Día**
- Gestión de tareas, hábitos, proyectos y metas
- Objetivo financiero con progreso y fecha meta (ejemplo: **$25,000**)
- Estadísticas visuales interactivas por semana, mes y trimestre
- Timeline de progreso con evidencias visuales
- Modo enfoque
- Vision board
- Dark/Light mode con diseño responsive priorizando móvil

## Stack

- React 19 + TypeScript
- Vite
- CSS modular por capas (tokens + componentes + layout)
- Datos mock tipados para demo funcional sin backend

## Arquitectura base

```text
src/
  App.tsx               # Shell principal + navegación + secciones clave
  App.css               # Sistema visual mobile-first y componentes UI
  data/mockData.ts      # Datos de ejemplo realistas
  types.ts              # Tipos de dominio (planificación, tareas, finanzas, etc.)
```

Esta estructura facilita integraciones posteriores con:

- autenticación
- backend/base de datos
- sincronización en tiempo real
- almacenamiento de imágenes
- analítica e inteligencia/recomendaciones

## Desarrollo

```bash
npm install
npm run dev
```

## Verificación

```bash
npm run lint
npm run build
```

## Próximos pasos sugeridos

1. Persistencia de datos y auth.
2. Feed/timeline con subida de imágenes reales.
3. Módulo de recomendaciones inteligentes y coach de productividad.
4. Sincronización en tiempo real y soporte multi-dispositivo.
