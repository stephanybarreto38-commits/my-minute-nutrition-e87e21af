## Objetivo

Simplificar la app a **un solo perfil de bebé por cuenta**, eliminar login social (Google/Apple), garantizar que **todos los datos del usuario persistan en la nube** (nada se pierde al refrescar o abrir desde otro dispositivo), y permitir **personalizar los platos del menú semanal** agregando componentes extra (ej. sumar una proteína a un plato de vegetales).

---

## 1. Volver a un solo perfil de bebé

- Quitar el selector de bebés (`BabySwitcher`) de la UI.
- En `useAppStore.ts`: reemplazar `babies[]` + `activeBabyId` por un único `baby` (el primero del usuario). Toda la lógica que hoy filtra por `activeBabyId` pasa a usar `baby.id`.
- En `ProfileScreen.tsx`: quitar botón "Agregar bebé" y la sección de compartir con pareja (`ShareSheet`). Dejar solo edición de nombre / fecha de nacimiento / método.
- No se borran tablas ni datos existentes; solo se oculta la funcionalidad multi-bebé y se toma siempre el primer `baby_profile` de la cuenta.

## 2. Quitar Google / Apple

- `LoginScreen.tsx`: eliminar botones de Google y Apple y su lógica (`signInWithOAuth`). Dejar solo email + contraseña (signup / login).
- Quitar el manejo de invite tokens de pareja en el login y en `App.tsx` (ya no aplica sin sharing).
- Backend: desactivar proveedores Google y Apple, dejando solo email habilitado.

## 3. Persistencia total en la nube (sin pérdida al refrescar)

Auditar cada pieza de estado del usuario y asegurarme de que se lea/escriba en Supabase, no solo en `localStorage`:

- **Tried foods** (frutas/alimentos probados) → tabla `tried_foods` scoped por `baby_id`. Verificar que `toggleTried` haga `upsert`/`delete` en Supabase y que al iniciar sesión se hidraten desde ahí.
- **Weekly plan** (`weekly_plans`) → guardar el plan generado y cualquier swap/edición.
- **Shopping list** (`shopping_items`) → guardar items, cantidades, `checked`, sección.
- **Pantry** ("Mi despensa", `pantry_items`) → guardar toggles.
- **Idioma** y **método de alimentación** → en `profiles` / `baby_profiles`.
- **Onboarding completado** → derivado de la existencia del `baby_profile` (ya funciona así).

Retirar los `localStorage.setItem` que hoy sirven de fuente principal para estos datos; mantener `localStorage` solo como caché opcional. La carga inicial de la app tras login siempre viene de Supabase, así abrir desde otro dispositivo muestra el mismo estado.

## 4. Personalizar platos del menú semanal

En `MyWeekScreen.tsx`, cada casillero (comida) hoy es una receta única e intercambiable. Cambios:

- Al tocar un plato, además de "Cambiar receta" agregar **"Personalizar plato"**.
- Modal de personalización con categorías: **Proteína**, **Vegetal**, **Carbohidrato**, **Fruta / extra**. El usuario puede sumar uno o varios componentes desde la lista de alimentos ya conocidos por la app (mismo catálogo de `foods`).
- El plato pasa a ser `{ recipeId, extras: FoodId[] }`. Se sigue mostrando el nombre de la receta base y debajo chips con los extras añadidos ("+ pollo", "+ arroz").
- La **lista de compras** consolida ingredientes de la receta base **más** los extras agregados (misma lógica de agrupar por sección y respetar la despensa).
- El plan personalizado se guarda en `weekly_plans` (agregar campo `extras jsonb` al row o dentro del JSON del plan).

## 5. Verificación

- Login con email → completar onboarding → marcar alimentos probados → generar semana → personalizar un plato agregando proteína → generar lista de compras → refrescar navegador y abrir en otro dispositivo → todo debe seguir igual.

---

## Detalles técnicos

- Migración SQL: añadir columna `extras jsonb default '[]'` a `weekly_plans` (o extender el shape del JSON existente si el plan ya se guarda serializado). No se eliminan `baby_shares` ni columnas multi-bebé — solo se dejan de usar en la UI para no romper datos existentes.
- Auth: `supabase--configure_social_auth` con `disable_providers: ["google", "apple"]`.
- Store: colapsar `babies[]` a `baby` con selectors compat para no reescribir cada pantalla; cada mutación de tried/plan/shopping/pantry hace la escritura optimista + `await` a Supabase.
- UI: quitar imports de `BabySwitcher` y `ShareSheet` en `App.tsx` y `ProfileScreen.tsx`.
