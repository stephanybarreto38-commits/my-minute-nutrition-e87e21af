GRANT USAGE ON SCHEMA app_private TO authenticated;
GRANT EXECUTE ON FUNCTION app_private.has_baby_access(uuid, uuid, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION app_private.has_role(uuid, app_role) TO authenticated;