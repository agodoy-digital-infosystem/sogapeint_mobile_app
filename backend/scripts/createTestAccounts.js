require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

// Importation des modèles
const User = require('../src/models/userModel');
const Company = require('../src/models/companyModel');  // Modèle Company

// Définir les associations entre les modèles
Company.hasMany(User, { foreignKey: 'companyId' });
User.belongsTo(Company, { foreignKey: 'companyId' });

// Fonction pour créer un compte utilisateur avec mot de passe "test1234"
async function createUser(email, role, lastName, companyId) {
  try {
    const hashedPassword = await bcrypt.hash('test1234', 10);

    const user = await User.create({
      email: email,
      password: hashedPassword,
      role: role,  // Rôle corrigé pour correspondre aux valeurs définies dans le modèle
      firstName: 'Test',
      lastName: lastName,
      companyId: companyId,
      isActive: true,  // Exemple d'autre champ obligatoire, à ajuster selon ton modèle
    });

    console.log(`Compte créé : Email = ${email}, Prénom = Test, Nom = ${lastName}, Role = ${role}`);
    return user;
  } catch (error) {
    console.error(`Erreur lors de la création de l'utilisateur ${email}:`, error);
  }
}

// Fonction pour créer plusieurs comptes de test
async function createTestAccounts() {
  try {
    // Connexion à la base de données
    await sequelize.authenticate();
    console.log('Connexion à la base de données réussie.');

    // Synchronisation des modèles (en respectant les relations)
    await sequelize.sync({ force: true });

    // Création d'une société pour les utilisateurs de test
    const company = await Company.create({
      name: 'Test Company',  // Nom de la société
      address: '123 Test Street',  // Adresse obligatoire
    });

    // Création des comptes de test en liant à cette société
    const user1 = await createUser('admin@test.com', 'Admin', 'Admin', company.id);  // Utilise "Admin" en majuscule
    const user2 = await createUser('user@test.com', 'Collaborateur', 'User', company.id);  // Utilise "Collaborateur" pour un utilisateur classique
    const user3 = await createUser('manager@test.com', 'Manager', 'Manager', company.id);  // Utilise "Manager"

    console.log('Tous les comptes de test ont été créés avec succès.');

    process.exit();
  } catch (error) {
    console.error('Erreur lors de la création des comptes de test:', error);
    process.exit(1);
  }
}

// Exécuter la fonction de création des comptes de test
createTestAccounts();
