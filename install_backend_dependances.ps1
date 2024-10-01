# Script PowerShell pour installer les dépendances du backend Node.js
Write-Host "Installation des dépendances nécessaires pour le backend Node.js..."

# Se positionner dans le dossier backend
Set-Location "./backend"

# Initialiser un projet npm
npm init -y

# Installer Express (framework web)
npm install express

# Installer Sequelize et PostgreSQL (ORM et driver pour la base de données)
npm install sequelize pg pg-hstore

# Installer dotenv (pour la gestion des variables d'environnement)
npm install dotenv

# Installer JSON Web Token (JWT) pour la gestion de l'authentification
npm install jsonwebtoken

# Installer bcrypt pour le hashage des mots de passe
npm install bcrypt

# Installer nodemailer pour la gestion des emails
npm install nodemailer

# Installer un middleware de gestion des erreurs
npm install express-async-errors

# Installer des outils de sécurité (Helmet pour renforcer la sécurité HTTP, CORS pour la gestion des requêtes externes)
npm install helmet cors

# Installer Morgan pour la journalisation des requêtes HTTP
npm install morgan

# Installer Body Parser pour analyser les requêtes entrantes en JSON
npm install body-parser

# Installer Express Validator pour la validation des entrées utilisateur
npm install express-validator

# Installer Firebase Admin SDK pour l'envoi des notifications push (si Firebase est utilisé)
npm install firebase-admin

# Installer Joi pour la validation des schémas de données
npm install joi

# Installer compression pour compresser les réponses HTTP
npm install compression

# Installer sequelize-cli pour la gestion des migrations de base de données
npm install sequelize-cli --save-dev

# Installer nodemon pour le redémarrage automatique du serveur pendant le développement
npm install nodemon --save-dev

# Ajouter des scripts npm utiles dans package.json
npm set-script start "node src/index.js"
npm set-script dev "nodemon src/index.js"

Write-Host "Dépendances installées avec succès."
Write-Host "Votre backend Node.js est prêt pour le développement."
