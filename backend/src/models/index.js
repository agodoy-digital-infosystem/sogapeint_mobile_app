/**
 * Ce fichier permet de centraliser les modèles et les associations entre les modèles.
 * 
 * Il importe les modèles et les associe entre eux en utilisant Sequelize.
 * Il exporte les modèles et l'instance Sequelize pour être utilisés dans d'autres fichiers.
 */
const sequelize = require('../../config/database');

// Importation des modèles
const BlogPost = require('./blogPostModel');
const Company = require('./companyModel');
const Document = require('./documentModel');
const Leave = require('./leaveModel');
const Notification = require('./notificationModel');
const Project = require('./projectModel');
const Signature = require('./signatureModel');
const User = require('./userModel');

// Associations entre les modèles
Company.hasMany(Project, { foreignKey: 'companyId' });
Company.hasMany(User, { foreignKey: 'companyId' });

Document.belongsTo(Project, { foreignKey: 'project_id' });
Document.belongsTo(Company, { foreignKey: 'company_id' });
Document.belongsToMany(User, {
    through: Signature,
    foreignKey: 'document_id',
    otherKey: 'user_id',
});

Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Notification.belongsTo(Document, { foreignKey: 'related_document_id', as: 'document' });

// Exportation des modèles et de l'instance Sequelize
module.exports = {
  sequelize,
  BlogPost,
  Company,
  Document,
  Leave,
  Notification,
  Project,
  Signature,
  User,
};
