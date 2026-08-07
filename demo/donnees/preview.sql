BEGIN;
DELETE FROM cpt.affectation_compteur; DELETE FROM cpt.compteur; DELETE FROM abo.participation_contrat; DELETE FROM abo.contrat_abonnement; DELETE FROM des.liaison_desserte_consommation; DELETE FROM des.point_consommation; DELETE FROM des.point_desserte;
INSERT INTO des.point_desserte(id,reference,statut,identifiant_commune,identifiant_adresse) VALUES ('10000000-0000-0000-0000-000000000001','PD-DEMO-001','DISPONIBLE','49000000-0000-0000-0000-000000000001','49000000-0000-0000-0000-000000000101');
INSERT INTO des.point_consommation(id,reference,statut,usage,identifiant_adresse) VALUES ('20000000-0000-0000-0000-000000000001','PC-DEMO-001','OUVERT','HABITATION','49000000-0000-0000-0000-000000000101');
INSERT INTO des.liaison_desserte_consommation(point_desserte_id,point_consommation_id,periode) VALUES ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001',tstzrange('2026-01-01',NULL,'[)'));
INSERT INTO cpt.compteur(id,numero_serie,statut,fabricant,modele,calibre) VALUES ('40000000-0000-0000-0000-000000000001','SEA-DEMO-0001','POSE','Aquamesure','A1','DN15');
INSERT INTO cpt.affectation_compteur(compteur_id,point_consommation_id,periode,index_pose,reference_intervention) VALUES ('40000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001',tstzrange('2026-01-02',NULL,'[)'),0,'INT-DEMO-001');
COMMIT;
