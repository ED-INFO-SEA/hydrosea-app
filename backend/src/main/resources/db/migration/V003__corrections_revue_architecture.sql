ALTER TABLE evt.evenement_metier RENAME COLUMN date_enregistrement TO date_enregistrement_technique;
ALTER TABLE evt.boite_envoi RENAME COLUMN disponible_le TO date_disponibilite;
ALTER TABLE evt.boite_envoi RENAME COLUMN publie_le TO date_publication;
ALTER INDEX evt.idx_evt_boite_envoi_a_publier RENAME TO idx_evt_boite_envoi_date_disponibilite;

ALTER TABLE app.idempotence RENAME COLUMN expire_le TO date_expiration;
ALTER TABLE app.idempotence ALTER COLUMN reponse DROP NOT NULL;
ALTER TABLE app.idempotence ALTER COLUMN statut_http DROP NOT NULL;
ALTER TABLE app.idempotence ADD COLUMN identifiant_client text;
ALTER TABLE app.idempotence ADD COLUMN etat varchar(20) NOT NULL DEFAULT 'TERMINE';
ALTER TABLE app.idempotence ADD COLUMN en_tetes_reponse jsonb;
ALTER TABLE app.idempotence ADD COLUMN date_fin_traitement timestamptz;
UPDATE app.idempotence SET identifiant_client='migration-v003', en_tetes_reponse='{}'::jsonb,
  date_fin_traitement=date_creation WHERE identifiant_client IS NULL;
ALTER TABLE app.idempotence ALTER COLUMN identifiant_client SET NOT NULL;
ALTER TABLE app.idempotence DROP CONSTRAINT pk_app_idempotence;
ALTER TABLE app.idempotence ADD CONSTRAINT pk_app_idempotence
  PRIMARY KEY (identifiant_client, operation, uri, cle);
ALTER TABLE app.idempotence ADD CONSTRAINT ck_app_idempotence_etat
  CHECK (etat IN ('EN_COURS','TERMINE','ECHEC'));
ALTER TABLE app.idempotence ADD CONSTRAINT ck_app_idempotence_reponse_terminee
  CHECK (etat <> 'TERMINE' OR (reponse IS NOT NULL AND statut_http IS NOT NULL AND en_tetes_reponse IS NOT NULL));
DROP INDEX app.idx_app_idempotence_expiration;
CREATE INDEX idx_app_idempotence_date_expiration ON app.idempotence(date_expiration);

CREATE OR REPLACE FUNCTION ref.interdire_changement_tiers_id() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.tiers_id IS DISTINCT FROM OLD.tiers_id THEN
    RAISE EXCEPTION 'tiers_id est immuable dans une spécialisation de Tiers';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_ref_physique_tiers_id_immuable BEFORE UPDATE OF tiers_id ON ref.tiers_personne_physique
  FOR EACH ROW EXECUTE FUNCTION ref.interdire_changement_tiers_id();
CREATE TRIGGER trg_ref_morale_tiers_id_immuable BEFORE UPDATE OF tiers_id ON ref.tiers_personne_morale
  FOR EACH ROW EXECUTE FUNCTION ref.interdire_changement_tiers_id();

COMMENT ON COLUMN evt.evenement_metier.date_enregistrement_technique IS 'Instant technique de persistance de l’événement.';
COMMENT ON COLUMN evt.boite_envoi.date_disponibilite IS 'Instant à partir duquel la publication peut être tentée.';
COMMENT ON COLUMN evt.boite_envoi.date_publication IS 'Instant de publication réussie.';
COMMENT ON COLUMN app.idempotence.identifiant_client IS 'Sujet JWT ou client OAuth2 à l’origine de la commande.';
COMMENT ON COLUMN app.idempotence.etat IS 'Cycle de traitement EN_COURS, TERMINE ou ECHEC.';
COMMENT ON COLUMN app.idempotence.en_tetes_reponse IS 'En-têtes HTTP contractuels rejoués sans recalcul.';
COMMENT ON COLUMN app.idempotence.date_expiration IS 'Fin de la période pendant laquelle la réponse est rejouable.';
