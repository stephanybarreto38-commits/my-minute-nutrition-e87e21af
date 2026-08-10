CREATE TABLE public.allowed_emails (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.allowed_emails TO authenticated;
GRANT ALL ON public.allowed_emails TO service_role;

ALTER TABLE public.allowed_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage allowed emails"
ON public.allowed_emails FOR ALL TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (app_private.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  is_admin boolean := lower(new.email) = 'stephanybarreto38@gmail.com';
  is_social boolean := (new.raw_app_meta_data ->> 'provider') IN ('google','apple');
  is_allowed boolean := EXISTS (SELECT 1 FROM public.allowed_emails a WHERE lower(a.email) = lower(new.email));
  approve boolean := is_admin OR is_social OR is_allowed;
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

  UPDATE public.baby_shares
     SET invited_user_id = new.id,
         status = 'accepted',
         updated_at = now()
   WHERE lower(invited_email) = lower(new.email)
     AND status = 'pending';

  RETURN new;
END;
$function$;