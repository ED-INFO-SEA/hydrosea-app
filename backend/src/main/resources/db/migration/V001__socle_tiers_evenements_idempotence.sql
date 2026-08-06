CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS ref;
CREATE SCHEMA IF NOT EXISTS evt;
CREATE SCHEMA IF NOT EXISTS app;

CREATE SEQUENCE ref.sequence_reference_tiers START WITH 1;

CREATE TABLE ref.tiers (
  id uuid CONSTRAINT pk_ref_tiers PRIMARY KEY DEFAULT gen_random_uuid(),
  reference varchar(40) NOT NULL CONSTRAINT uk_ref_tiers_reference UNIQUE,
  categorie varchar(30) NOT NULL CONSTRAINT ck_ref_tiers_categorie CHECK (categorie IN ('PERSONNE_PHYSIQUE','PERSONNE_MORALE')),
  statut varchar(20) NOT NULL DEFAULT 'ACTIF' CONSTRAINT ck_ref_tiers_statut CHECK (statut IN ('ACTIF','ARCHIVE')),
  tiers_fusionne_vers_id uuid,
  date_creation timestamptz NOT NULL DEFAULT now(), cree_par uuid,
  date_modification timestamptz NOT NULL DEFAULT now(), modifie_par uuid,
  version integer NOT NULL DEFAULT 1 CONSTRAINT ck_ref_tiers_version CHECK (version > 0),
  date_suppression timestamptz,
  CONSTRAINT fk_ref_tiers_fusion FOREIGN KEY (tiers_fusionne_vers_id) REFERENCES ref.tiers(id),
  CONSTRAINT ck_ref_tiers_archivage CHECK ((statut='ARCHIVE') = (date_suppression IS NOT NULL))
);
COMMENT ON TABLE ref.tiers IS 'BO-001 Tiers, identité stable et archivable sans suppression physique.';
COMMENT ON COLUMN ref.tiers.reference IS 'Référence fonctionnelle distincte de l’identifiant technique.';

CREATE TABLE ref.tiers_personne_physique (
  tiers_id uuid CONSTRAINT pk_ref_tiers_personne_physique PRIMARY KEY,
  nom text NOT NULL, nom_usage text, prenoms text NOT NULL, date_naissance date,
  CONSTRAINT fk_ref_tiers_personne_physique_tiers FOREIGN KEY (tiers_id) REFERENCES ref.tiers(id) ON DELETE RESTRICT
);
COMMENT ON TABLE ref.tiers_personne_physique IS 'Spécialisation personne physique exclusive de BO-001.';

CREATE TABLE ref.tiers_personne_morale (
  tiers_id uuid CONSTRAINT pk_ref_tiers_personne_morale PRIMARY KEY,
  raison_sociale text NOT NULL, siret varchar(14), forme_juridique text,
  CONSTRAINT uk_ref_tiers_personne_morale_siret UNIQUE (siret),
  CONSTRAINT ck_ref_tiers_personne_morale_siret CHECK (siret IS NULL OR siret ~ '^[0-9]{14}$'),
  CONSTRAINT fk_ref_tiers_personne_morale_tiers FOREIGN KEY (tiers_id) REFERENCES ref.tiers(id) ON DELETE RESTRICT
);
COMMENT ON TABLE ref.tiers_personne_morale IS 'Spécialisation personne morale exclusive de BO-001.';

CREATE OR REPLACE FUNCTION ref.verifier_specialisation_tiers() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE cible uuid; categorie_tiers text; nb_physique integer; nb_morale integer;
BEGIN
  IF TG_TABLE_NAME = 'tiers' THEN cible := COALESCE(NEW.id,OLD.id);
  ELSE cible := COALESCE(NEW.tiers_id,OLD.tiers_id);
  END IF;
  SELECT categorie INTO categorie_tiers FROM ref.tiers WHERE id=cible;
  IF categorie_tiers IS NULL THEN RETURN NULL; END IF;
  SELECT count(*) INTO nb_physique FROM ref.tiers_personne_physique WHERE tiers_id=cible;
  SELECT count(*) INTO nb_morale FROM ref.tiers_personne_morale WHERE tiers_id=cible;
  IF nb_physique + nb_morale <> 1 OR (categorie_tiers='PERSONNE_PHYSIQUE' AND nb_physique<>1)
     OR (categorie_tiers='PERSONNE_MORALE' AND nb_morale<>1) THEN
    RAISE EXCEPTION 'Spécialisation du Tiers % incohérente', cible;
  END IF;
  RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER trg_ref_tiers_specialisation AFTER INSERT OR UPDATE ON ref.tiers DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION ref.verifier_specialisation_tiers();
CREATE CONSTRAINT TRIGGER trg_ref_physique_specialisation AFTER INSERT OR UPDATE OR DELETE ON ref.tiers_personne_physique DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION ref.verifier_specialisation_tiers();
CREATE CONSTRAINT TRIGGER trg_ref_morale_specialisation AFTER INSERT OR UPDATE OR DELETE ON ref.tiers_personne_morale DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION ref.verifier_specialisation_tiers();

CREATE INDEX idx_ref_tiers_recherche ON ref.tiers(reference,categorie,statut);
CREATE INDEX idx_ref_tiers_physique_nom ON ref.tiers_personne_physique(lower(nom),lower(prenoms));
CREATE INDEX idx_ref_tiers_morale_raison ON ref.tiers_personne_morale(lower(raison_sociale));

CREATE TABLE evt.evenement_metier (
  id uuid CONSTRAINT pk_evt_evenement_metier PRIMARY KEY DEFAULT gen_random_uuid(),
  code_occurrence uuid NOT NULL DEFAULT gen_random_uuid() CONSTRAINT uk_evt_evenement_code_occurrence UNIQUE,
  type_evenement text NOT NULL, type_agregat text NOT NULL, agregat_id uuid NOT NULL,
  date_metier timestamptz NOT NULL, date_enregistrement timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL, correlation_id uuid NOT NULL, charge jsonb NOT NULL CONSTRAINT ck_evt_evenement_charge_objet CHECK(jsonb_typeof(charge)='object')
);
COMMENT ON TABLE evt.evenement_metier IS 'Fait métier immuable corrélé au parcours appelant.';

CREATE TABLE evt.boite_envoi (
  id uuid CONSTRAINT pk_evt_boite_envoi PRIMARY KEY DEFAULT gen_random_uuid(),
  evenement_metier_id uuid NOT NULL CONSTRAINT uk_evt_boite_envoi_evenement UNIQUE,
  statut varchar(20) NOT NULL DEFAULT 'A_PUBLIER' CONSTRAINT ck_evt_boite_envoi_statut CHECK(statut IN ('A_PUBLIER','PUBLIE','ERREUR')),
  tentatives integer NOT NULL DEFAULT 0 CONSTRAINT ck_evt_boite_envoi_tentatives CHECK(tentatives >= 0),
  disponible_le timestamptz NOT NULL DEFAULT now(), publie_le timestamptz, erreur text,
  CONSTRAINT fk_evt_boite_envoi_evenement FOREIGN KEY(evenement_metier_id) REFERENCES evt.evenement_metier(id)
);
CREATE INDEX idx_evt_boite_envoi_a_publier ON evt.boite_envoi(disponible_le) WHERE statut='A_PUBLIER';
COMMENT ON TABLE evt.boite_envoi IS 'File transactionnelle de publication RabbitMQ.';

CREATE TABLE app.idempotence (
  cle varchar(200) NOT NULL, operation varchar(100) NOT NULL, uri text NOT NULL,
  empreinte_requete varchar(64) NOT NULL, reponse jsonb NOT NULL, statut_http integer NOT NULL,
  expire_le timestamptz NOT NULL, correlation_id uuid NOT NULL, date_creation timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pk_app_idempotence PRIMARY KEY(cle,operation)
);
CREATE INDEX idx_app_idempotence_expiration ON app.idempotence(expire_le);
COMMENT ON TABLE app.idempotence IS 'Réponses persistées des commandes idempotentes.';
