# Supabase setup para LifeRPG

## 1. Crear proyecto

1. Entrar a Supabase.
2. Crear un proyecto nuevo.
3. Ir a `Project Settings > API`.
4. Copiar:
   - `Project URL`
   - `anon public key`

## 2. Variables locales

Crear un archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

`VITE_*` es obligatorio porque este MVP corre con Vite. Las variables `NEXT_PUBLIC_*` solo son necesarias si más adelante movés el componente a Next.js.

## 3. Base de datos

En Supabase, abrir `SQL Editor` y ejecutar el contenido de:

```txt
supabase/migrations/20260607000000_liferpg_schema.sql
```

Ese script crea:

- `life_rpg_profiles`
- `life_rpg_habits`
- `life_rpg_rewards`
- `life_rpg_bosses`
- `life_rpg_boss_subtasks`
- `life_rpg_activity_logs`
- índices, triggers de `updated_at` y políticas RLS por usuario.

## 4. Auth

Para probar rápido:

1. Ir a `Authentication > Providers > Email`.
2. Activar Email.
3. Si querés evitar confirmación por mail durante desarrollo, desactivar temporalmente `Confirm email`.

## 5. Reiniciar local

Después de crear `.env.local`, reiniciar el servidor:

```bash
npm run dev
```

o reconstruir el preview estático:

```bash
npm run build
node scripts/serve-dist.mjs 0.0.0.0 4174
```

## Estado actual de persistencia

El cliente ya persiste en Supabase:

- Perfil del jugador: nivel, XP, XP necesaria, créditos y stats.
- Hábitos/misiones simples.

El schema ya deja listas las tablas para persistir en próximos sprints:

- Recompensas del Mercado Negro.
- Bosses y subtareas.
- Activity logs reales para El Oráculo.
