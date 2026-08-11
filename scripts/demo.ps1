[CmdletBinding(DefaultParameterSetName = 'Demarrer')]
param(
    [Parameter(ParameterSetName = 'Demarrer')]
    [Parameter(ParameterSetName = 'Arreter')]
    [Parameter(ParameterSetName = 'Reinitialiser')]
    [string]$InfraPath,

    [Parameter(ParameterSetName = 'Arreter', Mandatory)]
    [switch]$Stop,

    [Parameter(ParameterSetName = 'Reinitialiser', Mandatory)]
    [switch]$Reset,

    [Parameter(ParameterSetName = 'Demarrer')]
    [ValidateRange(30, 1800)]
    [int]$TimeoutSeconds = 300,

    [Parameter(ParameterSetName = 'Reinitialiser')]
    [switch]$Force,

    [Parameter(DontShow)]
    [switch]$SelfTest
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)

$script:ApplicationPath = Split-Path -Parent $PSScriptRoot
$script:ApplicationCompose = Join-Path $script:ApplicationPath 'compose.dev.yaml'
$script:Etape = 0

function Write-Etape {
    param([string]$Message)
    $script:Etape++
    Write-Host "[$($script:Etape)/6] $Message" -ForegroundColor Cyan
}

function Stop-AvecErreur {
    param([string]$Message)
    throw $Message
}

function Get-CheminInfrastructure {
    param([string]$Chemin)
    $candidats = @()
    if ($Chemin) { $candidats += $Chemin }
    if ($env:HYDROSEA_INFRA_PATH) { $candidats += $env:HYDROSEA_INFRA_PATH }
    $candidats += (Join-Path $script:ApplicationPath '..\hydrosea-infra')
    foreach ($candidat in $candidats) {
        if (-not $candidat) { continue }
        $resolu = if ([System.IO.Path]::IsPathRooted($candidat)) {
            [System.IO.Path]::GetFullPath($candidat)
        } else {
            [System.IO.Path]::GetFullPath((Join-Path $script:ApplicationPath $candidat))
        }
        if ((Test-Path (Join-Path $resolu 'compose.yaml')) -and
            (Test-Path (Join-Path $resolu '.git'))) {
            return $resolu
        }
    }
    Stop-AvecErreur "Le dépôt hydrosea-infra est introuvable. Clonez-le à côté de hydrosea-app : git clone https://github.com/ED-INFO-SEA/hydrosea-infra.git ../hydrosea-infra"
}

function Read-FichierEnv {
    param([string]$Chemin)
    $valeurs = @{}
    foreach ($ligne in [System.IO.File]::ReadAllLines($Chemin)) {
        if ($ligne -match '^\s*#' -or $ligne -notmatch '^\s*([^=\s]+)=(.*)$') { continue }
        $nom = $Matches[1]
        $valeur = $Matches[2].Trim()
        if (($valeur.StartsWith('"') -and $valeur.EndsWith('"')) -or
            ($valeur.StartsWith("'") -and $valeur.EndsWith("'"))) {
            $valeur = $valeur.Substring(1, $valeur.Length - 2)
        }
        $valeurs[$nom] = $valeur
    }
    return $valeurs
}

function New-SecretLocal {
    $octets = New-Object byte[] 32
    $generateur = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try { $generateur.GetBytes($octets) } finally { $generateur.Dispose() }
    return [Convert]::ToBase64String($octets).TrimEnd('=').Replace('+', '_').Replace('/', '-')
}

function Write-Utf8SansBom {
    param([string]$Chemin, [string[]]$Lignes)
    [System.IO.File]::WriteAllLines($Chemin, $Lignes, [System.Text.UTF8Encoding]::new($false))
}

function Initialize-ConfigurationInfrastructure {
    param([string]$CheminInfrastructure)
    $envPath = Join-Path $CheminInfrastructure '.env'
    if (Test-Path $envPath) { return $envPath }
    $exemple = Join-Path $CheminInfrastructure '.env.example'
    if (-not (Test-Path $exemple)) {
        Stop-AvecErreur "Configuration absente : ni .env ni .env.example dans $CheminInfrastructure."
    }
    $lignes = foreach ($ligne in [System.IO.File]::ReadAllLines($exemple)) {
        if ($ligne -match '^([^=]+)=CHANGER_LOCAL_') { "$($Matches[1])=$(New-SecretLocal)" } else { $ligne }
    }
    Write-Utf8SansBom -Chemin $envPath -Lignes $lignes
    Write-Host 'Configuration .env locale créée avec des secrets aléatoires non destinés à la production.'
    return $envPath
}

function Initialize-ConfigurationApplication {
    param([hashtable]$Configuration)
    $obligatoires = @(
        'POSTGRES_APP_PASSWORD', 'POSTGRES_MIGRATION_PASSWORD', 'RABBITMQ_APP_PASSWORD',
        'MINIO_APP_USER', 'MINIO_APP_PASSWORD', 'KEYCLOAK_ADMIN', 'KEYCLOAK_ADMIN_PASSWORD'
    )
    foreach ($nom in $obligatoires) {
        if (-not $Configuration[$nom] -or $Configuration[$nom] -like 'CHANGER_LOCAL_*') {
            Stop-AvecErreur "La variable locale $nom est absente ou non initialisée dans hydrosea-infra/.env."
        }
    }
    $appEnvPath = Join-Path $script:ApplicationPath '.env'
    $existante = if (Test-Path $appEnvPath) { Read-FichierEnv $appEnvPath } else { @{} }
    $motsDePasse = @{}
    foreach ($nom in @('DEMO_ADMIN_PASSWORD', 'DEMO_RELATION_PASSWORD', 'DEMO_EXPLOITATION_PASSWORD')) {
        $motsDePasse[$nom] = if ($existante[$nom]) { $existante[$nom] } else { New-SecretLocal }
    }
    $lignes = @(
        'HYDROSEA_ENV=local',
        'POSTGRES_URL=jdbc:postgresql://postgres:5432/hydrosea',
        'POSTGRES_APP_USER=hydrosea_app',
        "POSTGRES_APP_PASSWORD=$($Configuration.POSTGRES_APP_PASSWORD)",
        'POSTGRES_MIGRATION_USER=hydrosea_migration',
        "POSTGRES_MIGRATION_PASSWORD=$($Configuration.POSTGRES_MIGRATION_PASSWORD)",
        'KEYCLOAK_ISSUER=http://auth.hydrosea.local/realms/hydrosea',
        'KEYCLOAK_AUDIENCE=hydrosea-api',
        'RABBITMQ_HOST=rabbitmq',
        'RABBITMQ_PORT=5672',
        'RABBITMQ_USER=hydrosea_app',
        "RABBITMQ_PASSWORD=$($Configuration.RABBITMQ_APP_PASSWORD)",
        'MINIO_URL=http://minio:9000',
        "MINIO_ACCESS_KEY=$($Configuration.MINIO_APP_USER)",
        "MINIO_SECRET_KEY=$($Configuration.MINIO_APP_PASSWORD)",
        'MINIO_BUCKET=hydrosea-documents',
        "DEMO_ADMIN_PASSWORD=$($motsDePasse.DEMO_ADMIN_PASSWORD)",
        "DEMO_RELATION_PASSWORD=$($motsDePasse.DEMO_RELATION_PASSWORD)",
        "DEMO_EXPLOITATION_PASSWORD=$($motsDePasse.DEMO_EXPLOITATION_PASSWORD)"
    )
    Write-Utf8SansBom -Chemin $appEnvPath -Lignes $lignes
    return $motsDePasse
}

function Invoke-DockerCompose {
    param([string]$Chemin, [string[]]$Arguments, [switch]$AutoriserEchec)
    Push-Location $Chemin
    try {
        & docker compose --env-file .env @Arguments
        if ($LASTEXITCODE -ne 0 -and -not $AutoriserEchec) {
            Stop-AvecErreur "docker compose a échoué dans $Chemin : $($Arguments -join ' ')"
        }
    } finally {
        Pop-Location
    }
}

function Wait-ComposeHealthy {
    param([string]$Chemin, [string]$Service, [int]$Timeout)
    $limite = (Get-Date).AddSeconds($Timeout)
    do {
        Push-Location $Chemin
        try {
            $conteneur = ([string](& docker compose --env-file .env ps -q $Service 2>$null)).Trim()
        } finally { Pop-Location }
        if ($conteneur) {
            $etat = (& docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' $conteneur 2>$null).Trim()
            if ($etat -eq 'healthy' -or $etat -eq 'running') { return }
            if ($etat -eq 'unhealthy' -or $etat -eq 'exited') {
                Stop-AvecErreur "Le service $Service est dans l’état $etat. Consultez : docker compose logs $Service"
            }
        }
        Write-Host "  Attente de $Service..."
        Start-Sleep -Seconds 3
    } while ((Get-Date) -lt $limite)
    Stop-AvecErreur "Le service $Service n’est pas devenu healthy en $Timeout secondes."
}

function Wait-Http {
    param([string]$Url, [string]$Nom, [int]$Timeout)
    $limite = (Get-Date).AddSeconds($Timeout)
    do {
        try {
            $reponse = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
            if ($reponse.StatusCode -ge 200 -and $reponse.StatusCode -lt 400) { return }
        } catch { }
        Write-Host "  Attente de $Nom..."
        Start-Sleep -Seconds 3
    } while ((Get-Date) -lt $limite)
    Stop-AvecErreur "$Nom ne répond pas sur $Url après $Timeout secondes. Vérifiez les journaux Docker Compose."
}

function Wait-BackendUp {
    param([string]$Url, [int]$Timeout)
    $limite = (Get-Date).AddSeconds($Timeout)
    do {
        try {
            $reponse = Invoke-RestMethod -Uri $Url -TimeoutSec 5
            if ($reponse.status -eq 'UP') { return }
        } catch { }
        Write-Host '  Attente du backend HydroSEA (état UP)...'
        Start-Sleep -Seconds 3
    } while ((Get-Date) -lt $limite)
    Stop-AvecErreur "Le backend ne retourne pas réellement UP sur $Url après $Timeout secondes. Vérifiez les journaux Docker Compose."
}

function Test-PortOccupeParAutreProcessus {
    param([int]$Port, [string]$Service)
    $ecoute = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if (-not $ecoute) { return }
    Push-Location $script:ApplicationPath
    try { $conteneur = ([string](& docker compose -f compose.dev.yaml ps -q $Service 2>$null)).Trim() }
    finally { Pop-Location }
    if (-not $conteneur) {
        Stop-AvecErreur "Le port local $Port est déjà occupé. Libérez-le avant de démarrer HydroSEA ($Service)."
    }
}

function Initialize-ResolutionLocale {
    if ($env:OS -ne 'Windows_NT') { return }
    $hostsPath = Join-Path $env:SystemRoot 'System32\drivers\etc\hosts'
    $contenu = [System.IO.File]::ReadAllText($hostsPath)
    if ($contenu -match '(?im)^\s*(?:127\.0\.0\.1|::1)\s+[^#\r\n]*\bauth\.hydrosea\.local\b') { return }
    $identite = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = [Security.Principal.WindowsPrincipal]::new($identite)
    if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
        Stop-AvecErreur 'La résolution de auth.hydrosea.local doit être initialisée. Relancez une fois PowerShell en administrateur ; le lanceur ajoutera uniquement les noms HydroSEA au fichier hosts.'
    }
    [System.IO.File]::AppendAllText(
        $hostsPath,
        "`r`n127.0.0.1 auth.hydrosea.local app.hydrosea.local`r`n",
        [System.Text.UTF8Encoding]::new($false)
    )
    Write-Host 'Résolution locale HydroSEA ajoutée au fichier hosts.'
}

function Invoke-Kcadm {
    param([string]$CheminInfrastructure, [string[]]$Arguments, [switch]$AutoriserEchec)
    Push-Location $CheminInfrastructure
    try {
        & docker compose --env-file .env exec -T keycloak /opt/keycloak/bin/kcadm.sh @Arguments
        if ($LASTEXITCODE -ne 0 -and -not $AutoriserEchec) {
            Stop-AvecErreur "La préparation Keycloak a échoué : kcadm.sh $($Arguments -join ' ')"
        }
    } finally { Pop-Location }
}

function Invoke-KcadmJson {
    param(
        [string]$CheminInfrastructure,
        [ValidateSet('create', 'update')][string]$Action,
        [string]$Ressource,
        [hashtable]$Donnees
    )
    $json = $Donnees | ConvertTo-Json -Depth 8 -Compress
    Push-Location $CheminInfrastructure
    try {
        $json | & docker compose --env-file .env exec -T keycloak `
            /opt/keycloak/bin/kcadm.sh $Action $Ressource -r hydrosea -f -
        if ($LASTEXITCODE -ne 0) {
            Stop-AvecErreur "La préparation Keycloak a échoué : $Action $Ressource avec JSON sur entrée standard."
        }
    } finally { Pop-Location }
}

function Initialize-KeycloakPreview {
    param([string]$CheminInfrastructure, [hashtable]$Configuration, [hashtable]$MotsDePasse)
    Invoke-Kcadm $CheminInfrastructure @('config', 'credentials', '--server', 'http://localhost:8080',
        '--realm', 'master', '--user', $Configuration.KEYCLOAK_ADMIN,
        '--password', $Configuration.KEYCLOAK_ADMIN_PASSWORD) | Out-Null

    $clientJson = Invoke-Kcadm $CheminInfrastructure @('get', 'clients', '-r', 'hydrosea',
        '-q', 'clientId=hydrosea-web', '--fields', 'id')
    $clientId = ($clientJson | ConvertFrom-Json)[0].id
    if (-not $clientId) { Stop-AvecErreur 'Le client Keycloak hydrosea-web est absent.' }
    Invoke-KcadmJson $CheminInfrastructure update "clients/$clientId" @{
        redirectUris = @('http://localhost:5173/*', 'http://app.hydrosea.local/*')
        webOrigins = @('http://localhost:5173', 'http://app.hydrosea.local')
    } | Out-Null

    $portees = @('tiers:lecture', 'tiers:ecriture', 'points:lecture', 'points:ecriture',
        'contrats:lecture', 'contrats:ecriture', 'comptage:lecture', 'comptage:ecriture')
    $scopes = Invoke-Kcadm $CheminInfrastructure @('get', 'client-scopes', '-r', 'hydrosea', '--fields', 'id,name') | ConvertFrom-Json
    foreach ($portee in $portees) {
        $scope = $scopes | Where-Object name -EQ $portee | Select-Object -First 1
        if (-not $scope) {
            Invoke-KcadmJson $CheminInfrastructure create 'client-scopes' @{
                name = $portee
                protocol = 'openid-connect'
            } | Out-Null
            $scopes = Invoke-Kcadm $CheminInfrastructure @('get', 'client-scopes', '-r', 'hydrosea', '--fields', 'id,name') | ConvertFrom-Json
            $scope = $scopes | Where-Object name -EQ $portee | Select-Object -First 1
        }
        $porteesParDefaut = Invoke-Kcadm $CheminInfrastructure @('get', "clients/$clientId/default-client-scopes", '-r', 'hydrosea', '--fields', 'id') | ConvertFrom-Json
        if ($scope.id -notin @($porteesParDefaut.id)) {
            Invoke-Kcadm $CheminInfrastructure @('update', "clients/$clientId/default-client-scopes/$($scope.id)", '-r', 'hydrosea') | Out-Null
        }
    }

    $scopes = Invoke-Kcadm $CheminInfrastructure @('get', 'client-scopes', '-r', 'hydrosea', '--fields', 'id,name') | ConvertFrom-Json
    $audience = $scopes | Where-Object name -EQ 'hydrosea-audience' | Select-Object -First 1
    if (-not $audience) {
        Invoke-KcadmJson $CheminInfrastructure create 'client-scopes' @{
            name = 'hydrosea-audience'
            protocol = 'openid-connect'
        } | Out-Null
        $scopes = Invoke-Kcadm $CheminInfrastructure @('get', 'client-scopes', '-r', 'hydrosea', '--fields', 'id,name') | ConvertFrom-Json
        $audience = $scopes | Where-Object name -EQ 'hydrosea-audience' | Select-Object -First 1
    }

    $donneesMapper = @{
        name = 'hydrosea-api'
        protocol = 'openid-connect'
        protocolMapper = 'oidc-audience-mapper'
        config = @{
            'included.custom.audience' = 'hydrosea-api'
            'access.token.claim' = 'true'
            'id.token.claim' = 'false'
            'introspection.token.claim' = 'true'
        }
    }
    $mappers = Invoke-Kcadm $CheminInfrastructure @('get', "client-scopes/$($audience.id)/protocol-mappers/models", '-r', 'hydrosea') | ConvertFrom-Json
    $mapper = $mappers | Where-Object name -EQ 'hydrosea-api' | Select-Object -First 1
    if ($mapper) {
        $donneesMapper.id = $mapper.id
        Invoke-KcadmJson $CheminInfrastructure update "client-scopes/$($audience.id)/protocol-mappers/models/$($mapper.id)" $donneesMapper | Out-Null
    } else {
        Invoke-KcadmJson $CheminInfrastructure create "client-scopes/$($audience.id)/protocol-mappers/models" $donneesMapper | Out-Null
    }
    $porteesParDefaut = Invoke-Kcadm $CheminInfrastructure @('get', "clients/$clientId/default-client-scopes", '-r', 'hydrosea', '--fields', 'id') | ConvertFrom-Json
    if ($audience.id -notin @($porteesParDefaut.id)) {
        Invoke-Kcadm $CheminInfrastructure @('update', "clients/$clientId/default-client-scopes/$($audience.id)", '-r', 'hydrosea') | Out-Null
    }

    $utilisateurs = @(
        @{ Nom = 'administrateur-demo'; Prenom = 'Administrateur'; NomFamille = 'Démonstration'; MotDePasse = $MotsDePasse.DEMO_ADMIN_PASSWORD },
        @{ Nom = 'agent-relation-demo'; Prenom = 'Agent'; NomFamille = 'Relation usagers'; MotDePasse = $MotsDePasse.DEMO_RELATION_PASSWORD },
        @{ Nom = 'agent-exploitation-demo'; Prenom = 'Agent'; NomFamille = 'Exploitation'; MotDePasse = $MotsDePasse.DEMO_EXPLOITATION_PASSWORD }
    )
    foreach ($utilisateur in $utilisateurs) {
        $existants = Invoke-Kcadm $CheminInfrastructure @('get', 'users', '-r', 'hydrosea', '-q', "username=$($utilisateur.Nom)", '--fields', 'id') | ConvertFrom-Json
        $identifiantUtilisateur = @($existants)[0].id
        $donneesUtilisateur = @{
            username = $utilisateur.Nom
            enabled = $true
            firstName = $utilisateur.Prenom
            lastName = $utilisateur.NomFamille
            email = "$($utilisateur.Nom)@hydrosea.local"
            emailVerified = $true
        }
        if ($identifiantUtilisateur) {
            Invoke-KcadmJson $CheminInfrastructure update "users/$identifiantUtilisateur" $donneesUtilisateur | Out-Null
        } else {
            Invoke-KcadmJson $CheminInfrastructure create 'users' $donneesUtilisateur | Out-Null
        }
        Invoke-Kcadm $CheminInfrastructure @('set-password', '-r', 'hydrosea', '--username',
            $utilisateur.Nom, '--new-password', $utilisateur.MotDePasse) | Out-Null
    }
}

function Stop-HydroseaPreview {
    param([string]$CheminInfrastructure)
    Write-Etape 'Vérification de Docker'
    & docker version *> $null
    if ($LASTEXITCODE -ne 0) { Stop-AvecErreur "Docker Desktop n’est pas démarré." }
    Write-Etape "Arrêt de l’application"
    Invoke-DockerCompose $script:ApplicationPath @('-f', 'compose.dev.yaml', 'down') | Out-Null
    Write-Etape "Arrêt de l’infrastructure"
    Invoke-DockerCompose $CheminInfrastructure @('stop') | Out-Null
    Write-Host 'Services HydroSEA arrêtés. Les volumes locaux sont conservés.' -ForegroundColor Green
}

function Reset-DonneesDemonstration {
    param([string]$CheminInfrastructure, [hashtable]$Configuration, [hashtable]$MotsDePasse)
    if ($env:HYDROSEA_ENV -eq 'production') { Stop-AvecErreur 'Réinitialisation interdite en production.' }
    if (-not $Force) {
        $confirmation = Read-Host 'Réinitialiser uniquement les données locales de démonstration ? Tapez OUI'
        if ($confirmation -ne 'OUI') { Stop-AvecErreur 'Réinitialisation annulée.' }
    }
    $sql = [System.IO.File]::ReadAllText((Join-Path $script:ApplicationPath 'demo\donnees\preview.sql'))
    Push-Location $CheminInfrastructure
    try {
        $administrateur = if ($Configuration.POSTGRES_ADMIN) { $Configuration.POSTGRES_ADMIN } else { 'hydrosea_admin' }
        $base = if ($Configuration.POSTGRES_DB) { $Configuration.POSTGRES_DB } else { 'hydrosea' }
        $sql | & docker compose --env-file .env exec -T postgres psql -v ON_ERROR_STOP=1 `
            -U $administrateur -d $base
        if ($LASTEXITCODE -ne 0) { Stop-AvecErreur 'La réinitialisation PostgreSQL a échoué.' }
    } finally { Pop-Location }
    Initialize-KeycloakPreview $CheminInfrastructure $Configuration $MotsDePasse
    Write-Host 'Données de démonstration réinitialisées ; volumes et structure préservés.' -ForegroundColor Green
}

function Invoke-SelfTest {
    $attendus = @('InfraPath', 'Stop', 'Reset', 'TimeoutSeconds', 'Force', 'SelfTest')
    $parametres = (Get-Command $PSCommandPath).Parameters.Keys
    foreach ($nom in $attendus) {
        if ($nom -notin $parametres) { Stop-AvecErreur "Paramètre attendu absent : $nom" }
    }
    $temp = Join-Path ([System.IO.Path]::GetTempPath()) "hydrosea-demo-$([Guid]::NewGuid())"
    New-Item -ItemType Directory -Path $temp | Out-Null
    try {
        $envTest = Join-Path $temp '.env'
        Write-Utf8SansBom $envTest @('NOM=valeur', 'SECRET="avec espaces"', '# commentaire')
        $lu = Read-FichierEnv $envTest
        if ($lu.NOM -ne 'valeur' -or $lu.SECRET -ne 'avec espaces') {
            Stop-AvecErreur 'Lecture .env invalide.'
        }
        if ((New-SecretLocal).Length -lt 32) { Stop-AvecErreur 'Secret local trop court.' }
        $infraTest = Join-Path $temp 'hydrosea-infra'
        New-Item -ItemType Directory -Path $infraTest | Out-Null
        Write-Utf8SansBom (Join-Path $infraTest '.env.example') @(
            'POSTGRES_DB=hydrosea',
            'POSTGRES_ADMIN_PASSWORD=CHANGER_LOCAL_ADMIN'
        )
        $configurationCreee = Initialize-ConfigurationInfrastructure $infraTest
        $configurationLue = Read-FichierEnv $configurationCreee
        if (-not $configurationLue.POSTGRES_ADMIN_PASSWORD -or
            $configurationLue.POSTGRES_ADMIN_PASSWORD -like 'CHANGER_LOCAL_*') {
            Stop-AvecErreur 'Création de la configuration locale invalide.'
        }
    } finally { Remove-Item -LiteralPath $temp -Recurse -Force }
    Write-Host 'Autocontrôle PowerShell réussi.' -ForegroundColor Green
}

try {
    if ($SelfTest) { Invoke-SelfTest; exit 0 }
    if ($env:HYDROSEA_ENV -eq 'production') { Stop-AvecErreur 'Le lanceur Preview refuse la production.' }
    $infra = Get-CheminInfrastructure $InfraPath
    if ($Stop) { Stop-HydroseaPreview $infra; exit 0 }

    Write-Etape 'Vérification de Docker'
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Stop-AvecErreur 'Docker est introuvable. Installez Docker Desktop puis rouvrez PowerShell.'
    }
    & docker version *> $null
    if ($LASTEXITCODE -ne 0) {
        Stop-AvecErreur "Docker Desktop est installé mais son moteur n’est pas démarré. Démarrez Docker Desktop puis réessayez."
    }
    & docker compose version *> $null
    if ($LASTEXITCODE -ne 0) { Stop-AvecErreur 'La commande docker compose est indisponible.' }

    $infraEnv = Initialize-ConfigurationInfrastructure $infra
    $configuration = Read-FichierEnv $infraEnv
    $motsDePasse = Initialize-ConfigurationApplication $configuration
    Initialize-ResolutionLocale

    Write-Etape "Démarrage de l’infrastructure"
    Invoke-DockerCompose $infra @('up', '-d') | Out-Null
    Wait-ComposeHealthy $infra 'postgres' $TimeoutSeconds
    Wait-ComposeHealthy $infra 'keycloak' $TimeoutSeconds
    Wait-Http 'http://auth.hydrosea.local/realms/hydrosea/.well-known/openid-configuration' 'Keycloak via Traefik' $TimeoutSeconds

    Write-Etape 'Préparation de Keycloak'
    Initialize-KeycloakPreview $infra $configuration $motsDePasse

    if ($Reset) {
        Reset-DonneesDemonstration $infra $configuration $motsDePasse
    }

    Write-Etape 'Démarrage du backend'
    Test-PortOccupeParAutreProcessus 8080 'backend'
    Test-PortOccupeParAutreProcessus 5173 'frontend'
    Invoke-DockerCompose $script:ApplicationPath @('-f', 'compose.dev.yaml', 'up', '--build', '-d') | Out-Null
    Wait-BackendUp 'http://localhost:8080/actuator/health' $TimeoutSeconds

    Write-Etape 'Démarrage du frontend'
    Wait-Http 'http://localhost:5173' 'Frontend HydroSEA' $TimeoutSeconds

    Write-Etape 'HydroSEA Preview prête'
    Write-Host 'Interface : http://localhost:5173' -ForegroundColor Green
    Write-Host 'Santé API : http://localhost:8080/actuator/health' -ForegroundColor Green
    Write-Host 'Identité : http://auth.hydrosea.local' -ForegroundColor Green
    Write-Host 'Comptes : administrateur-demo, agent-relation-demo, agent-exploitation-demo'
    Write-Host 'Les mots de passe locaux aléatoires sont conservés uniquement dans hydrosea-app/.env (ignoré par Git).'
} catch {
    Write-Error "Échec du lancement HydroSEA Preview : $($_.Exception.Message)"
    exit 1
}
