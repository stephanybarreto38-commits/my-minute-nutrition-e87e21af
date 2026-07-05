CREATE POLICY "Users create own pending profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id AND approved = false);

CREATE POLICY "Users create own user role"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND role = 'user'::public.app_role);