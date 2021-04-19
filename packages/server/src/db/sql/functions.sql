CREATE OR REPLACE FUNCTION get_last_week_experience(username TEXT)
RETURNS TABLE(experience INT)
AS $BODY$
    SELECT COALESCE(SUM (h.experience), 0)
    FROM history h
    WHERE h.player = username
    AND h.created_on BETWEEN NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER-7
    AND NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER;
$BODY$
LANGUAGE 'sql';

CREATE OR REPLACE FUNCTION get_last_month_experience(username TEXT)
RETURNS TABLE(experience INT)
AS $BODY$
    SELECT COALESCE(SUM (h.experience), 0)
    FROM history h
    WHERE h.player = username
    AND h.created_on >= DATE_TRUNC('month', NOW()) - INTERVAL '1 month'
    AND h.created_on < DATE_TRUNC('month', NOW())
$BODY$
LANGUAGE 'sql';

CREATE OR REPLACE FUNCTION get_current_month_experience(username TEXT)
RETURNS TABLE(experience INT)
AS $BODY$
    SELECT COALESCE(SUM (h.experience), 0)
    FROM history h
    WHERE h.player = username
    AND h.created_on >= DATE_TRUNC('month', CURRENT_DATE)
$BODY$
LANGUAGE 'sql';

CREATE OR REPLACE FUNCTION get_current_week_experience(username TEXT)
RETURNS TABLE(experience INT)
AS $BODY$
    SELECT COALESCE(SUM (h.experience), 0)
    FROM history h
    WHERE h.player = username
    AND h.created_on >= DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 day'
    AND h.created_on < NOW()
$BODY$
LANGUAGE 'sql';

CREATE OR REPLACE FUNCTION player_update()
RETURNS TRIGGER
LANGUAGE 'plpgsql'
AS $$
BEGIN
    IF OLD.online = NEW.online THEN
        NEW.last_modified = OLD.last_modified;
    ELSE
        NEW.last_modified = now();
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION history_update()
RETURNS TRIGGER
LANGUAGE 'plpgsql'
AS $$
BEGIN
    IF OLD.experience = NEW.experience THEN
        NEW.last_modified = OLD.last_modified;
    ELSE
        NEW.last_modified = now();
    END IF;
    RETURN NEW;
END;
$$;