import fs from 'node:fs';
const registre=fs.readFileSync('docs/preview/Operations-Preview-0.1.md','utf8');
const controleur=fs.readFileSync('backend/src/main/java/fr/hydrosea/preview/interfaceapi/ControleurPreview.java','utf8');
const attendues=['rechercher_points_desserte','creer_point_desserte','consulter_point_desserte','rendre_disponible_point_desserte','rechercher_points_consommation','creer_point_consommation','consulter_point_consommation','modifier_point_consommation','ouvrir_point_consommation','rattacher_point_consommation_desserte','rechercher_contrats_abonnement','creer_contrat_abonnement','consulter_contrat_abonnement','modifier_contrat_abonnement','ajouter_participant_contrat','valider_contrat_abonnement','activer_contrat_abonnement','rechercher_compteurs','enregistrer_compteur','consulter_compteur','modifier_compteur','poser_compteur','rechercher_affectations_compteur','consulter_affectation_compteur'];
const erreurs=attendues.filter(id=>!registre.includes(id));
for(const route of ['/points-desserte','/points-consommation','/contrats-abonnement','/compteurs','/affectations-compteur'])if(!controleur.includes(route))erreurs.push(`route ${route}`);
for(const interdit of ['releve','facture','paiement','resilier','remplacer','deposer'])if(new RegExp(`Mapping\\(\"[^\"]*${interdit}`,'i').test(controleur))erreurs.push(`hors périmètre ${interdit}`);
if(erreurs.length){console.error('Registre Preview incohérent:',erreurs.join(', '));process.exit(1)}
console.log(`${attendues.length} opérations Preview déclarées et routes exposées cohérentes.`);
