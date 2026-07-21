# Plan: Cuentas, multi-bebé, compartir con pareja y persistencia en la nube

Ya hay Lovable Cloud (Supabase) conectado con auth email/password, tabla `profiles`, `user_roles` y `baby_profiles` (un bebé por usuario). Vamos a extender eso — no reemplazarlo — para cubrir todo el pedido.

## 1. Auth social (Google + Apple)
- Habilitar Google y Apple en Lovable Cloud (managed OAuth, sin credenciales del usuario).
- En `LoginScreen.tsx`: agregar botones "Continuar con Google" y "Continuar con Apple" usando `lovable.auth.signInWithOAuth(...)` con `redirect_uri: window.location.origin`.
- Mantener email/password + el flujo de aprobación admin ya existente (los usuarios sociales también entran a `profiles` vía trigger `handle_new_user` y quedan `approved=false` hasta que el admin los apruebe — salvo el email admin que se auto-aprueba).

## 2. Multi-bebé por cuenta
- Migración: `baby_profiles` ya tiene `user_id + name + birth_date + method`. Agregar columna `id uuid PK default gen_random_uuid()` y quitar la unicidad implícita por usuario (hoy el código hace upsert por `user_id`). Índice por `user_id`.
- Nueva columna `active_baby_id uuid` en `profiles` para recordar el bebé seleccionado.
- `useAppStore.ts`: cambiar `baby: BabyProfile | null` → `babies: BabyProfile[]` + `activeBabyId: string | null`. Getter `activeBaby` derivado.
- `OnboardingScreen.tsx` se reutiliza como "crear perfil de bebé": se dispara automáticamente cuando `babies.length === 0` y también desde un botón "+ Agregar bebé" en el selector y en Perfil.

## 3. Selector de bebé
- Nuevo componente `BabySwitcher.tsx` en la barra superior del `PhoneFrame` (visible solo si `babies.length >= 1`): muestra el bebé activo con avatar/iniciales, dropdown con los demás, y opción "+ Agregar bebé".
- Cambiar de bebé actualiza `active_baby_id` en Supabase y recarga plan/lista/tried del bebé activo.

## 4. Compartir con mi pareja
- Nueva tabla `baby_shares (id, baby_id, owner_id, invited_email, invited_user_id nullable, role 'viewer'|'editor', status 'pending'|'accepted', token, created_at)`.
- RLS: el owner ve/gestiona sus shares; el invitado ve el baby cuando `invited_user_id = auth.uid()` y `status='accepted'`.
- Ajustar RLS de `baby_profiles`, `weekly_plans`, `shopping_items` para permitir acceso a usuarios con share aceptado sobre ese `baby_id` (via función security-definer `has_baby_access(baby_id, user_id)`).
- UI: en Perfil, botón "Compartir con mi pareja" abre sheet con:
  - Input de email + selector rol (Ver / Editar).
  - Link mágico `/(app)/?invite=<token>` que al abrirlo (autenticado) acepta el share (marca `invited_user_id = auth.uid()`, `status='accepted'`).
  - Lista de shares actuales con opción de revocar.
- Envío de email: usar Lovable Email (dominio managed) con un template simple "Te invitaron a Little Meal".

## 5. Idioma por cuenta
- Agregar `lang text default 'es'` a `profiles`. Al login hidratar `lang` desde Supabase; al cambiar idioma hacer `update profiles set lang=...`.

## 6. Persistencia en la nube: plan semanal + lista de compras
Nuevas tablas (scopeadas a `baby_id`, no a `user_id`, para que el share funcione):

- `weekly_plans (id, baby_id, week_start date, slots jsonb, created_at, updated_at)` — un registro por semana; `slots` = `[{day, mealKey, recipeId}]`.
- `shopping_items (id, baby_id, name, quantity int, section text, tag 'baby'|'mom', checked bool, source 'manual'|'week', created_at)`.
- `pantry_items (id, baby_id, food_name, created_at, unique(baby_id, food_name))`.
- `tried_foods (id, baby_id, food_id text, created_at, unique(baby_id, food_id))` — hoy también está en memoria/local.

RLS: acceso via `has_baby_access(baby_id, auth.uid())` (owner O share aceptado con rol correspondiente). `viewer` = solo SELECT; `editor` = SELECT/INSERT/UPDATE/DELETE.

`useAppStore.ts`:
- Reemplazar `localStorage` por lecturas/escrituras a Supabase para plan, shopping, pantry, tried.
- Al cambiar `activeBabyId` (o al login) → refetch de los cuatro conjuntos.
- Escrituras optimistas + rollback si falla.
- Migración one-shot: al primer login, si hay datos en `localStorage` con las claves viejas (`little_meal_shopping_*`, `little_meal_pantry_*`, plan) y el bebé activo no tiene datos en la nube, subirlos y limpiar localStorage.

## Orden de implementación
1. Migración SQL: columnas nuevas, tablas nuevas, `has_baby_access`, RLS + GRANTs.
2. Habilitar Google + Apple (managed) y botones sociales en `LoginScreen`.
3. Refactor de `useAppStore` a `babies[]` + `activeBabyId` + carga desde Supabase.
4. `BabySwitcher` en `PhoneFrame`, reuso de `OnboardingScreen` para "+ agregar bebé".
5. Mover plan / shopping / pantry / tried a Supabase con cargas por bebé activo.
6. Idioma en `profiles`.
7. Sharing: tabla, RLS, UI de invitación y aceptación por link/email.

## Preguntas para vos
- **Rol del invitado por defecto**: ¿"Editar" (co-cuidador real) o "Ver" con la opción de cambiarlo? Yo sugiero **Editar por defecto** porque el caso de uso es la pareja.
- **Email de invitación**: ¿te sirve que use Lovable Email con el remitente managed por ahora, o querés custom domain desde el arranque?
- **Aprobación admin**: ¿los usuarios que entran con Google/Apple también deben pasar por la aprobación manual, o los auto-aprobamos por venir de un proveedor verificado?
