DROP TRIGGER IF EXISTS on_update_history ON "public"."history";
DROP TRIGGER IF EXISTS on_update_player ON "public"."players";

CREATE TRIGGER on_update_history
BEFORE INSERT OR UPDATE ON history
FOR EACH ROW
EXECUTE PROCEDURE history_update();

CREATE TRIGGER on_update_player
BEFORE INSERT OR UPDATE ON players
FOR EACH ROW
EXECUTE PROCEDURE player_update();