# 1. Installation de PostgreSQL (si nécessaire)
Write-Host "Checking if PostgreSQL is installed..."

# Vous pouvez commenter cette partie si PostgreSQL est déjà installé
if (-Not (Get-Command "psql.exe" -ErrorAction SilentlyContinue)) {
    Write-Host "PostgreSQL is not installed. Installing PostgreSQL..."
    # Télécharge et installe PostgreSQL
    Invoke-WebRequest -Uri "https://get.enterprisedb.com/postgresql/postgresql-15.3-1-windows-x64.exe" -OutFile "postgresql-setup.exe"
    Start-Process -Wait -FilePath "postgresql-setup.exe" -ArgumentList "/verysilent", "/norestart"
} else {
    Write-Host "PostgreSQL is already installed."
}

# 2. Configuration des variables d'environnement pour PostgreSQL
$env:PGUSER = "postgres"      # Nom d'utilisateur par défaut de PostgreSQL
$env:PGPASSWORD = "password"  # Mettez le mot de passe que vous avez configuré lors de l'installation de PostgreSQL
$env:PGHOST = "localhost"     # L'hôte de la base de données
$env:PGPORT = "5432"          # Le port par défaut pour PostgreSQL

# 3. Création de la base de données
Write-Host "Creating the database..."
$databaseName = "sogapeint_db"

# Exécutez la commande SQL pour créer une base de données
Invoke-Expression "psql -U postgres -c `"CREATE DATABASE $databaseName;`""

Write-Host "Database $databaseName created successfully."

# 4. Installation des dépendances Node.js
Write-Host "Installing Node.js dependencies using npm..."
npm install

# 5. Génération du fichier .env
Write-Host "Creating .env file for environment configuration..."

$envFileContent = @"
# Configuration du serveur
PORT=3000

# Configuration de la base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=$databaseName
DB_USER=postgres
DB_PASSWORD=password

# Configuration de JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h

# Configuration des emails
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Firebase Cloud Messaging (FCM) server key
FCM_SERVER_KEY=your_firebase_server_key
"@

Set-Content -Path ".env" -Value $envFileContent

Write-Host ".env file created successfully."

# 6. Démarrage du serveur Node.js
Write-Host "Starting the server..."
npm start
