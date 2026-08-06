DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='hydrosea_app') THEN
    GRANT USAGE ON SCHEMA ref,evt,app TO hydrosea_app;
    GRANT SELECT,INSERT,UPDATE ON ref.tiers,ref.tiers_personne_physique,ref.tiers_personne_morale TO hydrosea_app;
    GRANT USAGE,SELECT ON SEQUENCE ref.sequence_reference_tiers TO hydrosea_app;
    GRANT SELECT,INSERT ON evt.evenement_metier TO hydrosea_app;
    GRANT SELECT,INSERT,UPDATE ON evt.boite_envoi TO hydrosea_app;
    GRANT SELECT,INSERT,UPDATE,DELETE ON app.idempotence TO hydrosea_app;
  END IF;
END $$;
