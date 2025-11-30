-- Add password expiry tracking fields to profiles
ALTER TABLE public.profiles
ADD COLUMN password_changed_at timestamp with time zone DEFAULT now(),
ADD COLUMN password_expiry_notified_at timestamp with time zone;

-- Create function to check if password is expired (90 days)
CREATE OR REPLACE FUNCTION public.is_password_expired(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    CASE 
      WHEN password_changed_at IS NULL THEN false
      WHEN password_changed_at < (now() - interval '90 days') THEN true
      ELSE false
    END
  FROM public.profiles
  WHERE id = user_id;
$$;

-- Create function to get days until password expires
CREATE OR REPLACE FUNCTION public.days_until_password_expires(user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    CASE 
      WHEN password_changed_at IS NULL THEN 90
      ELSE GREATEST(0, 90 - EXTRACT(day FROM (now() - password_changed_at))::integer)
    END
  FROM public.profiles
  WHERE id = user_id;
$$;

-- Trigger to update password_changed_at when user changes password via update_user
CREATE OR REPLACE FUNCTION public.track_password_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This trigger runs on auth.users updates
  -- We update the profiles table when password changes
  IF NEW.encrypted_password IS DISTINCT FROM OLD.encrypted_password THEN
    UPDATE public.profiles
    SET password_changed_at = now(),
        password_expiry_notified_at = NULL
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users (requires SECURITY DEFINER)
DROP TRIGGER IF EXISTS on_password_change ON auth.users;
CREATE TRIGGER on_password_change
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.track_password_change();