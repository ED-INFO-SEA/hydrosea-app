import fs from 'node:fs';

const fichier = process.argv[2];
if (!fichier) throw new Error('Chemin du contrat résolu manquant');
const api = JSON.parse(fs.readFileSync(fichier, 'utf8'));
const erreurs = [];
const methodes = new Set(['get', 'post', 'put', 'patch', 'delete']);
const identifiantsOperations = new Set();

function resoudre(reference) {
  if (!reference?.startsWith('#/')) return undefined;
  return reference.slice(2).split('/').reduce((valeur, segment) => valeur?.[segment.replaceAll('~1', '/').replaceAll('~0', '~')], api);
}
function dereferencer(noeud) { return noeud?.$ref ? dereferencer(resoudre(noeud.$ref)) : noeud; }
function contientParametre(operation, nom) {
  return (operation.parameters ?? []).map(dereferencer).some(parametre => parametre?.name === nom);
}
function parcourirSchema(schema, visiteur, visites = new Set()) {
  schema = dereferencer(schema);
  if (!schema || typeof schema !== 'object' || visites.has(schema)) return;
  visites.add(schema); visiteur(schema);
  for (const cle of ['allOf', 'oneOf', 'anyOf']) for (const enfant of schema[cle] ?? []) parcourirSchema(enfant, visiteur, visites);
  for (const enfant of Object.values(schema.properties ?? {})) parcourirSchema(enfant, visiteur, visites);
  parcourirSchema(schema.items, visiteur, visites);
}
function schemaRequete(operation) {
  const corps = dereferencer(operation.requestBody);
  return corps?.content?.['application/json']?.schema;
}

for (const [uri, item] of Object.entries(api.paths ?? {})) {
  if (!/^\/v[0-9]+\/[a-z0-9_{}\/-]+$/.test(uri)) erreurs.push(`URI non conforme: ${uri}`);
  for (const [methode, operation] of Object.entries(item)) {
    if (!methodes.has(methode)) continue;
    const nom = `${methode.toUpperCase()} ${uri}`;
    if (!operation.operationId) erreurs.push(`${nom}: operationId absent`);
    else if (identifiantsOperations.has(operation.operationId)) erreurs.push(`${nom}: operationId dupliqué`);
    else identifiantsOperations.add(operation.operationId);
    if (!operation.summary || !operation.description) erreurs.push(`${nom}: résumé ou description absent`);
    if (operation.security?.length && (!operation.responses?.['401'] || !operation.responses?.['403'])) erreurs.push(`${nom}: 401 ou 403 absent`);
    if (methode === 'get' && uri.includes('{') && !operation.responses?.['404']) erreurs.push(`${nom}: 404 absent`);
    if (methode !== 'get' && !operation.responses?.['409']) erreurs.push(`${nom}: 409 absent`);
    const avecVersion = contientParametre(operation, 'If-Match');
    if (avecVersion && !operation.responses?.['412']) erreurs.push(`${nom}: 412 absent avec If-Match`);
    if (!avecVersion && operation.responses?.['412']) erreurs.push(`${nom}: 412 déclaré sans If-Match`);
    const creationSansVersion = methode === 'post' && ['creer_', 'enregistrer_', 'importer_', 'synchroniser_', 'calculer_'].some(prefixe => operation.operationId?.startsWith(prefixe));
    if (creationSansVersion && avecVersion) erreurs.push(`${nom}: création/import avec If-Match`);
    if (methode === 'post' && !contientParametre(operation, 'Idempotency-Key')) erreurs.push(`${nom}: Idempotency-Key absent`);
    for (const extension of ['x-hydrosea-bs', 'x-hydrosea-rm', 'x-hydrosea-evt', 'x-hydrosea-tables']) if (!operation[extension]?.length) erreurs.push(`${nom}: ${extension} absent`);

    const entree = schemaRequete(operation);
    if (entree) parcourirSchema(entree, schema => {
      if (schema.readOnly) erreurs.push(`${nom}: schéma d’entrée contenant readOnly`);
      for (const [propriete, definition] of Object.entries(schema.properties ?? {})) {
        if (definition?.readOnly) erreurs.push(`${nom}: propriété d’entrée readOnly ${propriete}`);
        if (propriete.endsWith('_courant')) erreurs.push(`${nom}: projection temporelle acceptée en écriture ${propriete}`);
      }
    });
  }
}

const entreesAttendues = ['CreerTiers','ModifierTiers','CreerContratAbonnement','ModifierContratAbonnement','CreerPointConsommation','ModifierPointConsommation','CreerCompteur','ModifierCompteur','CreerAffectationCompteur','CreerReleve','CorrigerReleve','CalculerFacture','CreerPaiement','ImputerPaiement'];
for (const nom of entreesAttendues) if (!api.components?.schemas?.[nom]) erreurs.push(`Schéma d’entrée absent: ${nom}`);

const identifiantsRessources = {Tiers:'identifiant_tiers',ContratAbonnement:'identifiant_contrat',ParticipationContrat:'identifiant_participation',PointDesserte:'identifiant_point_desserte',PointConsommation:'identifiant_point_consommation',Compteur:'identifiant_compteur',AffectationCompteur:'identifiant_affectation',Releve:'identifiant_releve',Facture:'identifiant_facture',LigneFacture:'identifiant_ligne_facture',Paiement:'identifiant_paiement',ImputationPaiement:'identifiant_imputation',EvenementMetier:'identifiant_evenement'};
for (const [nom, identifiant] of Object.entries(identifiantsRessources)) {
  let present = false; parcourirSchema(api.components?.schemas?.[nom], schema => { if (schema.properties?.[identifiant]) present = true; });
  if (!present) erreurs.push(`${nom}: identifiant explicite ${identifiant} absent`);
}

for (const [nom, schemaBrut] of Object.entries(api.components?.schemas ?? {})) {
  if (!nom.startsWith('Page') || nom === 'PageResultats') continue;
  let items; parcourirSchema(schemaBrut, schema => { if (schema.properties?.resultats) items = dereferencer(schema.properties.resultats.items); });
  if (!items || (items.type === 'object' && !items.properties && !items.allOf)) erreurs.push(`${nom}: résultats non typés`);
}

const creerTiers = dereferencer(api.components?.schemas?.CreerTiers);
if (creerTiers?.oneOf?.length !== 2 || creerTiers?.discriminator?.propertyName !== 'categorie') erreurs.push('CreerTiers: oneOf/discriminateur invalide');
for (const variante of creerTiers?.oneOf ?? []) {
  const schema = dereferencer(variante);
  const physiques = Boolean(schema?.properties?.personne_physique);
  const morales = Boolean(schema?.properties?.personne_morale);
  if (physiques === morales) erreurs.push('CreerTiers: spécialisation non exclusive');
}

const motifPropriete = /^[a-z][a-z0-9_]*$/;
for (const [nom, schema] of Object.entries(api.components?.schemas ?? {})) parcourirSchema(schema, noeud => {
  for (const propriete of Object.keys(noeud.properties ?? {})) if (!motifPropriete.test(propriete)) erreurs.push(`${nom}: propriété JSON non conforme ${propriete}`);
});

if (api.info?.license) erreurs.push('Licence non arbitrée encore présente');
if (JSON.stringify(api).includes('diametre_nominal') || JSON.stringify(api).includes('date_mise_service')) erreurs.push('Propriété non alignée sur SQL');
if (api.components?.schemas?.PageResultats) erreurs.push('PageResultats générique encore présent');

if (erreurs.length) { for (const erreur of [...new Set(erreurs)]) console.error(erreur); process.exit(1); }
console.log(`${identifiantsOperations.size} opérations contrôlées; schémas d’entrée, HTTP, identifiants et pages conformes.`);
