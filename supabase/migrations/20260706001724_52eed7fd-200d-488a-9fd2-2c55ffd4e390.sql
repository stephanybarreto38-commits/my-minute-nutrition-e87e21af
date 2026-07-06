CREATE TABLE public.baby_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  birth_date date NOT NULL,
  method text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.baby_profiles TO authenticated;
GRANT ALL ON public.baby_profiles TO service_role;

ALTER TABLE public.baby_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own baby profile" ON public.baby_profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own baby profile" ON public.baby_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own baby profile" ON public.baby_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own baby profile" ON public.baby_profiles
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_baby_profiles_updated_at
  BEFORE UPDATE ON public.baby_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();