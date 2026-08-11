$ErrorActionPreference = 'Stop'
$racine = Split-Path -Parent $PSScriptRoot
$lanceur = Join-Path $racine 'scripts\demo.ps1'
$shell = Join-Path $racine 'scripts\preparer-keycloak-preview.sh'

$jetons = $null
$erreurs = $null
[void][System.Management.Automation.Language.Parser]::ParseFile($lanceur, [ref]$jetons, [ref]$erreurs)
if ($erreurs.Count -gt 0) {
    throw "Syntaxe PowerShell invalide : $($erreurs.Message -join '; ')"
}

$contenu = [System.IO.File]::ReadAllText($lanceur)
$attendus = @(
    'docker compose', 'HYDROSEA_INFRA_PATH', 'KEYCLOAK_ADMIN_PASSWORD',
    'http://localhost:8080', 'actuator/health', 'Get-NetTCPConnection',
    'Wait-ComposeHealthy', 'Wait-Http', 'Wait-BackendUp', 'Invoke-KcadmJson',
    'UTF8Encoding]::new($false)',
    'http://auth.hydrosea.local/realms/hydrosea/.well-known/openid-configuration',
    'ParameterSetName = ''Arreter''',
    'ParameterSetName = ''Reinitialiser'''
)
foreach ($attendu in $attendus) {
    if (-not $contenu.Contains($attendu)) { throw "Contrôle absent du lanceur : $attendu" }
}
if ($contenu -match '(?i)C:\\Users\\|docker\s+exec\s+hydrosea-keycloak|KEYCLOAK_ADMIN_USER') {
    throw 'Le lanceur contient un chemin utilisateur ou une ancienne hypothèse Keycloak interdite.'
}
if ($contenu -match 'redirectUris=\[|webOrigins=\[|config\."included\.custom\.audience"') {
    throw 'Du JSON Keycloak est encore échappé dans les arguments de kcadm.sh.'
}
foreach ($compte in @('administrateur-demo', 'agent-relation-demo', 'agent-exploitation-demo')) {
    if (($contenu.Split($compte).Count - 1) -lt 1) { throw "Compte Preview absent : $compte" }
}
foreach ($invariant in @(
    "Where-Object name -EQ 'hydrosea-api'",
    '$donneesMapper.id = $mapper.id',
    'default-client-scopes',
    "Where-Object name -EQ `$portee",
    "if (`$identifiantUtilisateur)"
)) {
    if (-not $contenu.Contains($invariant)) { throw "Invariant idempotent Keycloak absent : $invariant" }
}

$compose = [System.IO.File]::ReadAllText((Join-Path $racine 'compose.dev.yaml'))
if ($compose -notmatch 'networks:\s*\[frontal,base_donnees,messagerie,stockage,identite\]') {
    throw 'Le backend ne rejoint pas tous les réseaux requis, dont frontal.'
}
if ($compose -notmatch "ports:\s*\['127\.0\.0\.1:8080:8080'\]") {
    throw 'La publication locale du backend a changé.'
}

$contenuShell = [System.IO.File]::ReadAllText($shell)
foreach ($attendu in @('docker compose', 'exec -T keycloak', 'KEYCLOAK_ADMIN', 'http://localhost:8080')) {
    if (-not $contenuShell.Contains($attendu)) { throw "Contrôle absent du script shell : $attendu" }
}
if ($contenuShell -match 'docker\s+exec|hydrosea-keycloak|localhost:8081|KEYCLOAK_ADMIN_USER') {
    throw "Le script shell dépend encore d’un conteneur ou d’une variable codés en dur."
}

Write-Host 'Contrôles statiques du lancement Windows réussis.' -ForegroundColor Green
