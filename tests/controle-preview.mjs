import fs from 'node:fs';
import { parse } from '../frontend/node_modules/yaml/dist/index.js';

const contrat=parse(fs.readFileSync('api/openapi.bundle.yaml','utf8'));
const registre=fs.readFileSync('docs/preview/Operations-Preview-0.1.md','utf8');
const java=fs.readFileSync('backend/src/main/java/fr/hydrosea/preview/interfaceapi/ControleurPreview.java','utf8');
const operationIds=[...registre.matchAll(/\b(?:rechercher|creer|consulter|modifier|archiver|rendre|ouvrir|rattacher|ajouter|valider|activer|enregistrer|poser)_[a-z0-9_]+\b/g)].map(m=>m[0]);
const tiers=new Set(['rechercher_tiers','creer_tiers','consulter_tiers','modifier_tiers','archiver_tiers']);
const attendues=[...new Set(operationIds)].filter(id=>!tiers.has(id));
const openapi=new Map();
for(const [uri,chemin] of Object.entries(contrat.paths))for(const methode of ['get','post','patch','put','delete']){
  const operation=chemin[methode]; if(!operation?.operationId)continue;
  const scopes=operation.security?.flatMap(s=>s.oauth2??[])??[];
  const succes=Object.keys(operation.responses??{}).find(s=>/^2\d\d$/.test(s));
  const schema=operation.requestBody?.content?.['application/json']?.schema;
  openapi.set(operation.operationId,{methode:methode.toUpperCase(),uri,scope:scopes[0],succes,corps:Boolean(schema)});
}
const implementees=new Map();
const creation=new Set(['creer_point_desserte','creer_point_consommation','rattacher_point_consommation_desserte',
  'creer_contrat_abonnement','ajouter_participant_contrat','enregistrer_compteur','poser_compteur']);
const motif=/@OperationPreview\("([^"]+)"\)\s+@(Get|Post|Patch|Put|Delete)Mapping\("([^"]+)"\)([^\n]*)/g;
for(const m of java.matchAll(motif)){
  const suite=m[4]; const scope=suite.match(/SCOPE_([^']+)/)?.[1];
  implementees.set(m[1],{methode:m[2].toUpperCase(),uri:`/v1${m[3]}`,scope,
    succes:creation.has(m[1])?'201':'200',corps:/@RequestBody/.test(suite)});
}
const normaliser=uri=>uri.replace(/\{[^}]+\}/g,'{}');
const erreurs=[];
if(attendues.length!==24)erreurs.push(`registre: 24 operationId attendus, ${attendues.length} trouvés`);
for(const id of attendues){const c=openapi.get(id),b=implementees.get(id);if(!c){erreurs.push(`${id}: absent OpenAPI`);continue}if(!b){erreurs.push(`${id}: route backend absente`);continue}
  for(const propriete of ['methode','scope','succes','corps'])if(c[propriete]!==b[propriete])erreurs.push(`${id}: ${propriete} backend=${b[propriete]} OpenAPI=${c[propriete]}`);
  if(normaliser(c.uri)!==normaliser(b.uri))erreurs.push(`${id}: URI backend=${b.uri} OpenAPI=${c.uri}`);
}
for(const id of implementees.keys())if(!attendues.includes(id))erreurs.push(`${id}: annotée mais absente du registre`);
if(erreurs.length){console.error(erreurs.join('\n'));process.exit(1)}
console.log('24 opérations Preview vérifiées : OpenAPI, méthode, URI, scope, entrée, réponse et contrôleur.');
