CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE SCHEMA IF NOT EXISTS des;
CREATE SCHEMA IF NOT EXISTS abo;
CREATE SCHEMA IF NOT EXISTS cpt;
CREATE SEQUENCE des.reference_point_desserte_seq;
CREATE SEQUENCE des.reference_point_consommation_seq;
CREATE SEQUENCE abo.reference_contrat_seq;

CREATE TABLE des.point_desserte (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), reference varchar(40) UNIQUE NOT NULL,
 statut varchar(20) NOT NULL CHECK(statut IN ('CREE','DISPONIBLE','INDISPONIBLE','RETIRE')),
 identifiant_commune uuid NOT NULL, identifiant_adresse uuid NOT NULL, version integer NOT NULL DEFAULT 1,
 date_creation timestamptz NOT NULL DEFAULT now(), date_modification timestamptz NOT NULL DEFAULT now(), cree_par uuid, modifie_par uuid, date_suppression timestamptz
);
CREATE TABLE des.point_consommation (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), reference varchar(40) UNIQUE NOT NULL,
 statut varchar(20) NOT NULL DEFAULT 'PREPARE' CHECK(statut IN ('PREPARE','OUVERT','FERME')),
 usage text NOT NULL, identifiant_adresse uuid NOT NULL, version integer NOT NULL DEFAULT 1,
 date_creation timestamptz NOT NULL DEFAULT now(), date_modification timestamptz NOT NULL DEFAULT now(), cree_par uuid, modifie_par uuid, date_suppression timestamptz
);
CREATE TABLE des.liaison_desserte_consommation (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), point_desserte_id uuid NOT NULL REFERENCES des.point_desserte,
 point_consommation_id uuid NOT NULL REFERENCES des.point_consommation,
 periode tstzrange NOT NULL, version integer NOT NULL DEFAULT 1, date_creation timestamptz NOT NULL DEFAULT now(), cree_par uuid, modifie_par uuid,
 EXCLUDE USING gist (point_consommation_id WITH =, periode WITH &&)
);
CREATE INDEX idx_pd_recherche ON des.point_desserte(reference,statut);
CREATE INDEX idx_pc_recherche ON des.point_consommation(reference,statut,usage);

CREATE TABLE abo.contrat_abonnement (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), reference varchar(40) UNIQUE NOT NULL,
 point_consommation_id uuid NOT NULL REFERENCES des.point_consommation,
 statut varchar(20) NOT NULL DEFAULT 'BROUILLON' CHECK(statut IN ('BROUILLON','A_VALIDER','VALIDE','ACTIF')),
 nature_abonnement text NOT NULL, date_demande date NOT NULL, date_effet date NOT NULL,
 version integer NOT NULL DEFAULT 1, date_creation timestamptz NOT NULL DEFAULT now(), date_modification timestamptz NOT NULL DEFAULT now(), cree_par uuid, modifie_par uuid, date_suppression timestamptz
);
CREATE TABLE abo.participation_contrat (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), contrat_id uuid NOT NULL REFERENCES abo.contrat_abonnement,
 tiers_id uuid NOT NULL REFERENCES ref.tiers, role_contractuel varchar(30) NOT NULL CHECK(role_contractuel IN ('TITULAIRE_PRINCIPAL','SOLIDAIRE')),
 principal boolean NOT NULL, responsabilite_financiere boolean NOT NULL DEFAULT true,
 periode daterange NOT NULL, version integer NOT NULL DEFAULT 1, date_creation timestamptz NOT NULL DEFAULT now(), date_modification timestamptz NOT NULL DEFAULT now(), cree_par uuid, modifie_par uuid,
 CONSTRAINT ck_participation_principal CHECK (NOT principal OR (role_contractuel='TITULAIRE_PRINCIPAL' AND responsabilite_financiere))
);
CREATE UNIQUE INDEX uk_titulaire_principal_actif ON abo.participation_contrat(contrat_id) WHERE principal AND upper_inf(periode);
CREATE UNIQUE INDEX uk_contrat_actif_point ON abo.contrat_abonnement(point_consommation_id) WHERE statut='ACTIF';

CREATE TABLE cpt.compteur (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), numero_serie varchar(100) UNIQUE NOT NULL,
 statut varchar(20) NOT NULL DEFAULT 'DISPONIBLE' CHECK(statut IN ('DISPONIBLE','POSE')),
 fabricant text NOT NULL, modele text, calibre text, version integer NOT NULL DEFAULT 1,
 date_creation timestamptz NOT NULL DEFAULT now(), date_modification timestamptz NOT NULL DEFAULT now(), cree_par uuid, modifie_par uuid, date_suppression timestamptz
);
CREATE TABLE cpt.affectation_compteur (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), compteur_id uuid NOT NULL REFERENCES cpt.compteur,
 point_consommation_id uuid NOT NULL REFERENCES des.point_consommation,
 periode tstzrange NOT NULL, index_pose numeric(14,3) NOT NULL, reference_intervention text NOT NULL,
 version integer NOT NULL DEFAULT 1, date_creation timestamptz NOT NULL DEFAULT now(), date_modification timestamptz NOT NULL DEFAULT now(), cree_par uuid, modifie_par uuid, date_suppression timestamptz,
 EXCLUDE USING gist (compteur_id WITH =, periode WITH &&)
);
CREATE INDEX idx_compteur_numero ON cpt.compteur(numero_serie,statut);
CREATE INDEX idx_affectation_point ON cpt.affectation_compteur(point_consommation_id,lower(periode));
