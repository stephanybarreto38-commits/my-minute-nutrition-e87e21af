DROP POLICY IF EXISTS "Users view own or shared baby" ON public.baby_profiles;
DROP POLICY IF EXISTS "Users update own or editor-shared baby" ON public.baby_profiles;

CREATE POLICY "Users view own or shared baby"
ON public.baby_profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR app_private.has_baby_access(id, auth.uid(), false)
);

CREATE POLICY "Users update own or editor-shared baby"
ON public.baby_profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id
  OR app_private.has_baby_access(id, auth.uid(), true)
)
WITH CHECK (
  auth.uid() = user_id
  OR app_private.has_baby_access(id, auth.uid(), true)
);