# Création de la structure des dossiers backend (Node.js)
Write-Host "Création de la structure des dossiers backend (Node.js)..."

# Dossier principal du backend
New-Item -Path "./backend" -ItemType Directory

# Dossiers pour le code source
New-Item -Path "./backend/src" -ItemType Directory
New-Item -Path "./backend/src/controllers" -ItemType Directory
New-Item -Path "./backend/src/models" -ItemType Directory
New-Item -Path "./backend/src/routes" -ItemType Directory
New-Item -Path "./backend/src/middlewares" -ItemType Directory
New-Item -Path "./backend/src/services" -ItemType Directory

# Fichiers vides principaux pour le backend
New-Item -Path "./backend/src/index.js" -ItemType File

# Fichiers pour les contrôleurs
New-Item -Path "./backend/src/controllers/authController.js" -ItemType File
New-Item -Path "./backend/src/controllers/documentController.js" -ItemType File
New-Item -Path "./backend/src/controllers/leaveController.js" -ItemType File
New-Item -Path "./backend/src/controllers/projectController.js" -ItemType File
New-Item -Path "./backend/src/controllers/notificationController.js" -ItemType File
New-Item -Path "./backend/src/controllers/blogController.js" -ItemType File # Ajout du contrôleur pour les articles de blog
New-Item -Path "./backend/src/controllers/signatureController.js" -ItemType File # Ajout du contrôleur pour les signatures

# Fichiers pour les modèles
New-Item -Path "./backend/src/models/userModel.js" -ItemType File
New-Item -Path "./backend/src/models/documentModel.js" -ItemType File
New-Item -Path "./backend/src/models/projectModel.js" -ItemType File
New-Item -Path "./backend/src/models/companyModel.js" -ItemType File
New-Item -Path "./backend/src/models/signatureModel.js" -ItemType File
New-Item -Path "./backend/src/models/leaveModel.js" -ItemType File
New-Item -Path "./backend/src/models/notificationModel.js" -ItemType File
New-Item -Path "./backend/src/models/blogPostModel.js" -ItemType File # Ajout du modèle pour les articles de blog

# Fichiers pour les routes
New-Item -Path "./backend/src/routes/authRoutes.js" -ItemType File
New-Item -Path "./backend/src/routes/documentRoutes.js" -ItemType File
New-Item -Path "./backend/src/routes/leaveRoutes.js" -ItemType File
New-Item -Path "./backend/src/routes/projectRoutes.js" -ItemType File
New-Item -Path "./backend/src/routes/notificationRoutes.js" -ItemType File
New-Item -Path "./backend/src/routes/blogRoutes.js" -ItemType File # Ajout des routes pour les articles de blog
New-Item -Path "./backend/src/routes/signatureRoutes.js" -ItemType File # Ajout des routes pour les signatures

# Fichiers pour les middlewares
New-Item -Path "./backend/src/middlewares/authMiddleware.js" -ItemType File
New-Item -Path "./backend/src/middlewares/errorMiddleware.js" -ItemType File

# Fichiers pour les services
New-Item -Path "./backend/src/services/authService.js" -ItemType File
New-Item -Path "./backend/src/services/documentService.js" -ItemType File
New-Item -Path "./backend/src/services/notificationService.js" -ItemType File
New-Item -Path "./backend/src/services/leaveService.js" -ItemType File
New-Item -Path "./backend/src/services/projectService.js" -ItemType File
New-Item -Path "./backend/src/services/emailService.js" -ItemType File
New-Item -Path "./backend/src/services/blogService.js" -ItemType File # Ajout du service pour les articles de blog
New-Item -Path "./backend/src/services/signatureService.js" -ItemType File # Ajout du service pour les signatures

# Fichiers de configuration
New-Item -Path "./backend/config" -ItemType Directory
New-Item -Path "./backend/config/env.js" -ItemType File
New-Item -Path "./backend/config/jwtConfig.js" -ItemType File

# Dossiers pour les tests
New-Item -Path "./backend/tests" -ItemType Directory
New-Item -Path "./backend/tests/authController.test.js" -ItemType File
New-Item -Path "./backend/tests/documentController.test.js" -ItemType File
New-Item -Path "./backend/tests/projectController.test.js" -ItemType File
New-Item -Path "./backend/tests/leaveController.test.js" -ItemType File
New-Item -Path "./backend/tests/blogController.test.js" -ItemType File # Ajout du fichier de test pour les articles de blog
New-Item -Path "./backend/tests/signatureController.test.js" -ItemType File # Ajout du fichier de test pour les signatures

# Fichiers pour les utilitaires et autres
New-Item -Path "./backend/utils" -ItemType Directory
New-Item -Path "./backend/utils/emailHelper.js" -ItemType File
New-Item -Path "./backend/utils/passwordHelper.js" -ItemType File

Write-Host "Architecture backend créée avec succès."
