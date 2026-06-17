# LifeRPG

LifeRPG es un tracker de hábitos gamificado con estética Dark/Neon RPG. La idea central es convertir hábitos diarios, proyectos grandes y recompensas personales en un sistema de progresión inspirado en videojuegos: XP, atributos, bosses, economía interna, analíticas y un Dungeon Master IA.

> Estado actual: MVP funcional en React + Supabase, listo para cerrar configuración de producción y deploy.

## Demo

- Deploy: pendiente de publicar al final del proceso de production readiness.
- Usuario demo local: configurar en `.env.local` con `VITE_DEMO_EMAIL` y `VITE_DEMO_PASSWORD`.
- Usuario demo cloud: crear en Supabase Auth cuando se configure el proyecto real.

## Stack

- React 19
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- Recharts
- Supabase Auth + Postgres + RLS

## Features principales

- Pantalla de título/login con estética cyberpunk.
- Dashboard RPG con nivel, XP, créditos y atributos.
- CRUD de hábitos/misiones personalizadas.
- Sistema de XP, level up y stats.
- Economía dual con cyberCredits.
- Mercado Negro para recompensas reales.
- Boss Fights para proyectos largos con subtareas.
- Forja manual de bosses personalizados por usuario.
- Boss Roster para alternar entre varios jefes/proyectos activos.
- Analíticas del jugador con radar chart y heatmap de actividad.
- Dungeon Master IA mockeado para convertir metas en bosses jugables.
- Persistencia Supabase para perfil, hábitos, recompensas, bosses, subtareas y logs.
- Modo demo local para desarrollo sin Supabase.
- Carga diferida de El Oráculo para evitar cargar Recharts en el bundle inicial.
- Metadatos web, favicon SVG y manifest PWA básico para deploy.
- Tests unitarios de reglas de XP, level up, logs y rachas con Vitest.
- Pantalla de Auth separada del dashboard principal para mejorar mantenibilidad.
- Boss Arena separada en `BossArena.jsx`, con creación manual de jefes y ataques.
- Selección de boss activo con historial visual de jefes derrotados.

## Arquitectura de datos

Supabase guarda la partida en tablas separadas por responsabilidad:

- `life_rpg_profiles`: nivel, XP, XP necesaria, créditos y stats.
- `life_rpg_habits`: misiones/hábitos del usuario.
- `life_rpg_rewards`: recompensas del Mercado Negro.
- `life_rpg_bosses`: proyectos grandes convertidos en jefes.
- `life_rpg_boss_subtasks`: ataques/subtareas de cada boss.
- `life_rpg_activity_logs`: historial para analíticas y heatmap.

Todas las tablas usan Row Level Security para que cada usuario solo pueda acceder a sus propios datos.

## Instalación local

```bash
npm install
npm run dev
```

Crear `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key

VITE_DEMO_EMAIL=demo@liferpg.local
VITE_DEMO_PASSWORD=demo1234
```

Si no se configuran las variables de Supabase, la app entra en modo demo local.

## Supabase

1. Crear un proyecto en Supabase.
2. Activar Auth por email/password.
3. Ejecutar la migración:

```txt
supabase/migrations/20260607000000_liferpg_schema.sql
```

4. Crear un usuario demo desde `Authentication > Users`.
5. Cargar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en el entorno de deploy.

Más detalle en [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md).

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run test:run
```

## Calidad

- CI con GitHub Actions en cada push y pull request a `main`.
- `npm run test:run` valida reglas de gameplay y analíticas.
- `npm run build` valida que el bundle de producción compile correctamente.

## Decisiones técnicas

- Tailwind CSS permite iterar rápido una UI con identidad fuerte sin CSS externo.
- Supabase acelera auth, persistencia y políticas RLS sobre Postgres.
- Las mutaciones críticas usan UI optimista para mantener sensación de juego.
- Los logs de actividad se modelan como eventos planos para poder alimentar analíticas.
- La vista de analíticas se carga con `React.lazy` para reducir el peso inicial del dashboard.
- El HTML base incluye descripción, Open Graph, theme color y manifest para que el deploy no se vea genérico.
- La lógica pura de progresión y analíticas vive en `src/lib/gameplay.js`, testeada con Vitest.
- La pantalla de título/login vive en `src/components/AuthScreen.jsx`, separada del flujo de gameplay.
- La Boss Arena vive en `src/components/BossArena.jsx`; el componente maneja la UI de combate y la forja manual, mientras el dashboard conserva la persistencia Supabase.
- El dashboard mantiene `selectedBossId` para permitir múltiples bosses por jugador sin perder la sincronización por `user_id`.
- El Dungeon Master IA está mockeado, pero la UI ya espera un contrato JSON estructurado.

## Roadmap de producción

- Separar más secciones del componente principal en módulos pequeños.
- Mover la IA a una API serverless para proteger la key del proveedor.
- Agregar tests de flujos críticos de UI.
- Optimizar bundle con lazy loading para vistas pesadas como El Oráculo.
- Crear una landing/case study dentro del portfolio.
- Deploy final en Vercel con Supabase real.

## Portfolio story

Este proyecto demuestra frontend avanzado, diseño de producto, modelado de datos, integración con backend as a service, UI optimista, gamificación y capacidad de construir una experiencia visual con personalidad sin perder foco técnico.
