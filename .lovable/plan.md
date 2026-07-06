
## Problema

Al refrescar, la app pide otra vez nombre/fecha/método porque el perfil del bebé solo vive en memoria (`useAppStore`). La sesión de auth sí se conserva, pero el `baby` y `method` se pierden.

## Solución

Guardar el perfil del bebé por usuario en la base de datos y cargarlo al iniciar sesión.

### 1. Base de datos

Nueva tabla `public.baby_profiles`:
- `user_id` (PK, FK a auth.users)
- `name`, `birth_date`, `method`

Con RLS: cada usuario solo lee/escribe su propia fila. GRANT a `authenticated` y `service_role`.

### 2. Frontend

- **`useAppStore.ts`**: en `hydrate()` (tras confirmar sesión), consultar `baby_profiles` del usuario. Si existe → cargar `baby` y `method` en el estado y saltar directo a `screen: 'home'`. Si no existe → mantener `screen: 'onboarding'`.
- **`completeOnboarding`**: hacer `upsert` a `baby_profiles` antes de navegar a home.
- **Cambio de método** (en ProfileScreen vía `setMethod`): persistir el cambio con `update` en la misma tabla.
- **Logout**: limpiar estado local como ya se hace.

### 3. Comportamiento resultante

- Primer ingreso → onboarding → guarda en la nube → home.
- Refresh o nuevo dispositivo → login → carga perfil → home directo.
- Sin perfil guardado → onboarding.

## Fuera de alcance

Persistencia de `foodLogs` y `shoppingList` (siguen solo en memoria). Se puede hacer después si lo pides.
