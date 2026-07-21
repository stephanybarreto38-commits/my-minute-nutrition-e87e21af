
CREATE SCHEMA IF NOT EXISTS app_private;

CREATE OR REPLACE FUNCTION app_private.has_baby_access(_baby_id uuid, _user_id uuid, _need_editor boolean DEFAULT false)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.baby_profiles b
    WHERE b.id = _baby_id AND b.user_id = _user_id
  ) OR EXISTS (
    SELECT 1 FROM public.baby_shares s
    WHERE s.baby_id = _baby_id
      AND s.invited_user_id = _user_id
      AND s.status = 'accepted'
      AND (NOT _need_editor OR s.role = 'editor')
  );
$$;

REVOKE ALL ON FUNCTION app_private.has_baby_access(uuid, uuid, boolean) FROM PUBLIC, anon, authenticated;

-- Repoint policies to the app_private version
DROP POLICY IF EXISTS "Users view own or shared baby" ON public.baby_profiles;
DROP POLICY IF EXISTS "Users update own or editor-shared baby" ON public.baby_profiles;
CREATE POLICY "Users view own or shared baby" ON public.baby_profiles FOR SELECT TO authenticated
  USING (app_private.has_baby_access(id, auth.uid(), false));
CREATE POLICY "Users update own or editor-shared baby" ON public.baby_profiles FOR UPDATE TO authenticated
  USING (app_private.has_baby_access(id, auth.uid(), true))
  WITH CHECK (app_private.has_baby_access(id, auth.uid(), true));

DROP POLICY IF EXISTS "Read weekly plans with baby access" ON public.weekly_plans;
DROP POLICY IF EXISTS "Insert weekly plans as editor" ON public.weekly_plans;
DROP POLICY IF EXISTS "Update weekly plans as editor" ON public.weekly_plans;
DROP POLICY IF EXISTS "Delete weekly plans as editor" ON public.weekly_plans;
CREATE POLICY "Read weekly plans with baby access" ON public.weekly_plans FOR SELECT TO authenticated
  USING (app_private.has_baby_access(baby_id, auth.uid(), false));
CREATE POLICY "Insert weekly plans as editor" ON public.weekly_plans FOR INSERT TO authenticated
  WITH CHECK (app_private.has_baby_access(baby_id, auth.uid(), true));
CREATE POLICY "Update weekly plans as editor" ON public.weekly_plans FOR UPDATE TO authenticated
  USING (app_private.has_baby_access(baby_id, auth.uid(), true))
  WITH CHECK (app_private.has_baby_access(baby_id, auth.uid(), true));
CREATE POLICY "Delete weekly plans as editor" ON public.weekly_plans FOR DELETE TO authenticated
  USING (app_private.has_baby_access(baby_id, auth.uid(), true));

DROP POLICY IF EXISTS "Read shopping with baby access" ON public.shopping_items;
DROP POLICY IF EXISTS "Insert shopping as editor" ON public.shopping_items;
DROP POLICY IF EXISTS "Update shopping as editor" ON public.shopping_items;
DROP POLICY IF EXISTS "Delete shopping as editor" ON public.shopping_items;
CREATE POLICY "Read shopping with baby access" ON public.shopping_items FOR SELECT TO authenticated
  USING (app_private.has_baby_access(baby_id, auth.uid(), false));
CREATE POLICY "Insert shopping as editor" ON public.shopping_items FOR INSERT TO authenticated
  WITH CHECK (app_private.has_baby_access(baby_id, auth.uid(), true));
CREATE POLICY "Update shopping as editor" ON public.shopping_items FOR UPDATE TO authenticated
  USING (app_private.has_baby_access(baby_id, auth.uid(), true))
  WITH CHECK (app_private.has_baby_access(baby_id, auth.uid(), true));
CREATE POLICY "Delete shopping as editor" ON public.shopping_items FOR DELETE TO authenticated
  USING (app_private.has_baby_access(baby_id, auth.uid(), true));

DROP POLICY IF EXISTS "Read pantry with baby access" ON public.pantry_items;
DROP POLICY IF EXISTS "Insert pantry as editor" ON public.pantry_items;
DROP POLICY IF EXISTS "Delete pantry as editor" ON public.pantry_items;
CREATE POLICY "Read pantry with baby access" ON public.pantry_items FOR SELECT TO authenticated
  USING (app_private.has_baby_access(baby_id, auth.uid(), false));
CREATE POLICY "Insert pantry as editor" ON public.pantry_items FOR INSERT TO authenticated
  WITH CHECK (app_private.has_baby_access(baby_id, auth.uid(), true));
CREATE POLICY "Delete pantry as editor" ON public.pantry_items FOR DELETE TO authenticated
  USING (app_private.has_baby_access(baby_id, auth.uid(), true));

DROP POLICY IF EXISTS "Read tried with baby access" ON public.tried_foods;
DROP POLICY IF EXISTS "Insert tried as editor" ON public.tried_foods;
DROP POLICY IF EXISTS "Update tried as editor" ON public.tried_foods;
DROP POLICY IF EXISTS "Delete tried as editor" ON public.tried_foods;
CREATE POLICY "Read tried with baby access" ON public.tried_foods FOR SELECT TO authenticated
  USING (app_private.has_baby_access(baby_id, auth.uid(), false));
CREATE POLICY "Insert tried as editor" ON public.tried_foods FOR INSERT TO authenticated
  WITH CHECK (app_private.has_baby_access(baby_id, auth.uid(), true));
CREATE POLICY "Update tried as editor" ON public.tried_foods FOR UPDATE TO authenticated
  USING (app_private.has_baby_access(baby_id, auth.uid(), true))
  WITH CHECK (app_private.has_baby_access(baby_id, auth.uid(), true));
CREATE POLICY "Delete tried as editor" ON public.tried_foods FOR DELETE TO authenticated
  USING (app_private.has_baby_access(baby_id, auth.uid(), true));

DROP FUNCTION IF EXISTS public.has_baby_access(uuid, uuid, boolean);
