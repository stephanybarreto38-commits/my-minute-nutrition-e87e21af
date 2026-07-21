
-- =========================================================
-- 1. profiles: active baby + language
-- =========================================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS active_baby_id uuid,
  ADD COLUMN IF NOT EXISTS lang text NOT NULL DEFAULT 'es',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND approved = (SELECT approved FROM public.profiles WHERE id = auth.uid()));

-- =========================================================
-- 2. Restructure baby_profiles to support multiple babies
-- =========================================================
ALTER TABLE public.baby_profiles
  ADD COLUMN IF NOT EXISTS id uuid NOT NULL DEFAULT gen_random_uuid();

ALTER TABLE public.baby_profiles DROP CONSTRAINT IF EXISTS baby_profiles_pkey;
ALTER TABLE public.baby_profiles ADD CONSTRAINT baby_profiles_pkey PRIMARY KEY (id);
CREATE INDEX IF NOT EXISTS baby_profiles_user_id_idx ON public.baby_profiles(user_id);

-- Backfill profiles.active_baby_id for existing single-baby users
UPDATE public.profiles p
SET active_baby_id = b.id
FROM public.baby_profiles b
WHERE b.user_id = p.id AND p.active_baby_id IS NULL;

-- =========================================================
-- 3. baby_shares (partner invitations)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.baby_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id uuid NOT NULL REFERENCES public.baby_profiles(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_email text NOT NULL,
  invited_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('viewer','editor')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','revoked')),
  token text NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS baby_shares_baby_idx ON public.baby_shares(baby_id);
CREATE INDEX IF NOT EXISTS baby_shares_invited_user_idx ON public.baby_shares(invited_user_id);
CREATE INDEX IF NOT EXISTS baby_shares_invited_email_idx ON public.baby_shares(lower(invited_email));
CREATE UNIQUE INDEX IF NOT EXISTS baby_shares_token_uidx ON public.baby_shares(token);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.baby_shares TO authenticated;
GRANT ALL ON public.baby_shares TO service_role;
ALTER TABLE public.baby_shares ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- 4. Access-control helpers (security definer, bypass RLS)
-- =========================================================
CREATE OR REPLACE FUNCTION public.has_baby_access(_baby_id uuid, _user_id uuid, _need_editor boolean DEFAULT false)
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

GRANT EXECUTE ON FUNCTION public.has_baby_access(uuid, uuid, boolean) TO authenticated;

-- =========================================================
-- 5. baby_shares policies
-- =========================================================
CREATE POLICY "Owner manages own shares"
  ON public.baby_shares FOR ALL TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Invitee views own shares"
  ON public.baby_shares FOR SELECT TO authenticated
  USING (auth.uid() = invited_user_id
         OR lower(invited_email) = lower(coalesce((auth.jwt() ->> 'email'), '')));

CREATE POLICY "Invitee accepts own share"
  ON public.baby_shares FOR UPDATE TO authenticated
  USING (
    (auth.uid() = invited_user_id
     OR lower(invited_email) = lower(coalesce((auth.jwt() ->> 'email'), '')))
    AND status = 'pending'
  )
  WITH CHECK (
    invited_user_id = auth.uid()
    AND status IN ('accepted','pending')
  );

-- =========================================================
-- 6. Extend baby_profiles RLS to include shared access
-- =========================================================
DROP POLICY IF EXISTS "Users view own baby profile" ON public.baby_profiles;
DROP POLICY IF EXISTS "Users update own baby profile" ON public.baby_profiles;

CREATE POLICY "Users view own or shared baby"
  ON public.baby_profiles FOR SELECT TO authenticated
  USING (public.has_baby_access(id, auth.uid(), false));

CREATE POLICY "Users update own or editor-shared baby"
  ON public.baby_profiles FOR UPDATE TO authenticated
  USING (public.has_baby_access(id, auth.uid(), true))
  WITH CHECK (public.has_baby_access(id, auth.uid(), true));

-- =========================================================
-- 7. weekly_plans
-- =========================================================
CREATE TABLE IF NOT EXISTS public.weekly_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id uuid NOT NULL REFERENCES public.baby_profiles(id) ON DELETE CASCADE,
  week_start date NOT NULL,
  slots jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (baby_id, week_start)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.weekly_plans TO authenticated;
GRANT ALL ON public.weekly_plans TO service_role;
ALTER TABLE public.weekly_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Read weekly plans with baby access"
  ON public.weekly_plans FOR SELECT TO authenticated
  USING (public.has_baby_access(baby_id, auth.uid(), false));
CREATE POLICY "Insert weekly plans as editor"
  ON public.weekly_plans FOR INSERT TO authenticated
  WITH CHECK (public.has_baby_access(baby_id, auth.uid(), true));
CREATE POLICY "Update weekly plans as editor"
  ON public.weekly_plans FOR UPDATE TO authenticated
  USING (public.has_baby_access(baby_id, auth.uid(), true))
  WITH CHECK (public.has_baby_access(baby_id, auth.uid(), true));
CREATE POLICY "Delete weekly plans as editor"
  ON public.weekly_plans FOR DELETE TO authenticated
  USING (public.has_baby_access(baby_id, auth.uid(), true));

CREATE TRIGGER update_weekly_plans_updated_at BEFORE UPDATE ON public.weekly_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- 8. shopping_items
-- =========================================================
CREATE TABLE IF NOT EXISTS public.shopping_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id uuid NOT NULL REFERENCES public.baby_profiles(id) ON DELETE CASCADE,
  name_es text NOT NULL,
  name_en text NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  section text NOT NULL DEFAULT 'pantry' CHECK (section IN ('produce','protein','dairy','pantry')),
  tag text NOT NULL DEFAULT 'baby' CHECK (tag IN ('baby','mom')),
  checked boolean NOT NULL DEFAULT false,
  source text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual','week')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS shopping_items_baby_idx ON public.shopping_items(baby_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shopping_items TO authenticated;
GRANT ALL ON public.shopping_items TO service_role;
ALTER TABLE public.shopping_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Read shopping with baby access"
  ON public.shopping_items FOR SELECT TO authenticated
  USING (public.has_baby_access(baby_id, auth.uid(), false));
CREATE POLICY "Insert shopping as editor"
  ON public.shopping_items FOR INSERT TO authenticated
  WITH CHECK (public.has_baby_access(baby_id, auth.uid(), true));
CREATE POLICY "Update shopping as editor"
  ON public.shopping_items FOR UPDATE TO authenticated
  USING (public.has_baby_access(baby_id, auth.uid(), true))
  WITH CHECK (public.has_baby_access(baby_id, auth.uid(), true));
CREATE POLICY "Delete shopping as editor"
  ON public.shopping_items FOR DELETE TO authenticated
  USING (public.has_baby_access(baby_id, auth.uid(), true));

CREATE TRIGGER update_shopping_items_updated_at BEFORE UPDATE ON public.shopping_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- 9. pantry_items
-- =========================================================
CREATE TABLE IF NOT EXISTS public.pantry_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id uuid NOT NULL REFERENCES public.baby_profiles(id) ON DELETE CASCADE,
  food_key text NOT NULL,
  name_es text NOT NULL,
  name_en text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (baby_id, food_key)
);
CREATE INDEX IF NOT EXISTS pantry_items_baby_idx ON public.pantry_items(baby_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pantry_items TO authenticated;
GRANT ALL ON public.pantry_items TO service_role;
ALTER TABLE public.pantry_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Read pantry with baby access"
  ON public.pantry_items FOR SELECT TO authenticated
  USING (public.has_baby_access(baby_id, auth.uid(), false));
CREATE POLICY "Insert pantry as editor"
  ON public.pantry_items FOR INSERT TO authenticated
  WITH CHECK (public.has_baby_access(baby_id, auth.uid(), true));
CREATE POLICY "Delete pantry as editor"
  ON public.pantry_items FOR DELETE TO authenticated
  USING (public.has_baby_access(baby_id, auth.uid(), true));

-- =========================================================
-- 10. tried_foods (baby food history)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.tried_foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id uuid NOT NULL REFERENCES public.baby_profiles(id) ON DELETE CASCADE,
  food_id text NOT NULL,
  reaction text,
  notes text,
  tried_on date NOT NULL DEFAULT (now()::date),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (baby_id, food_id)
);
CREATE INDEX IF NOT EXISTS tried_foods_baby_idx ON public.tried_foods(baby_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tried_foods TO authenticated;
GRANT ALL ON public.tried_foods TO service_role;
ALTER TABLE public.tried_foods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Read tried with baby access"
  ON public.tried_foods FOR SELECT TO authenticated
  USING (public.has_baby_access(baby_id, auth.uid(), false));
CREATE POLICY "Insert tried as editor"
  ON public.tried_foods FOR INSERT TO authenticated
  WITH CHECK (public.has_baby_access(baby_id, auth.uid(), true));
CREATE POLICY "Update tried as editor"
  ON public.tried_foods FOR UPDATE TO authenticated
  USING (public.has_baby_access(baby_id, auth.uid(), true))
  WITH CHECK (public.has_baby_access(baby_id, auth.uid(), true));
CREATE POLICY "Delete tried as editor"
  ON public.tried_foods FOR DELETE TO authenticated
  USING (public.has_baby_access(baby_id, auth.uid(), true));

CREATE TRIGGER update_tried_foods_updated_at BEFORE UPDATE ON public.tried_foods
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- 11. Update handle_new_user: auto-approve social sign-ins,
--     auto-accept any pending shares for that email.
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  is_admin boolean := lower(new.email) = 'stephanybarreto38@gmail.com';
  is_social boolean := (new.raw_app_meta_data ->> 'provider') IN ('google','apple');
  approve boolean := is_admin OR is_social;
BEGIN
  INSERT INTO public.profiles (id, email, approved)
  VALUES (new.id, new.email, approve)
  ON CONFLICT (id) DO NOTHING;

  IF is_admin THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (new.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (new.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  -- Auto-link any pending shares invited to this email
  UPDATE public.baby_shares
     SET invited_user_id = new.id,
         status = 'accepted',
         updated_at = now()
   WHERE lower(invited_email) = lower(new.email)
     AND status = 'pending';

  RETURN new;
END;
$$;
