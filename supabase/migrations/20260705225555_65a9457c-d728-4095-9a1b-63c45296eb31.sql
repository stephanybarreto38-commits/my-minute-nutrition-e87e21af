GRANT INSERT ON public.user_roles TO authenticated;

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;