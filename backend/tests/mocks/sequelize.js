// backend/tests/mocks/sequelize.js
const SequelizeMock = require('sequelize-mock');

// Créer une instance de Sequelize mock
const DBConnectionMock = new SequelizeMock();

// Définir le modèle User mock
const UserMock = DBConnectionMock.define('User', {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Utilisateur de Test'
});

// Définir le modèle BlogPost mock
const BlogPostMock = DBConnectionMock.define('BlogPost', {
    id: '123e4567-e89b-12d3-a456-426614174001',
    title: 'Titre de Test',
    content: 'Ceci est un contenu de test',
    author_id: '123e4567-e89b-12d3-a456-426614174000',
    created_at: new Date(),
    updated_at: new Date()
});

// Définir le modèle Company mock
const CompanyMock = DBConnectionMock.define('Company', {
    id: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Entreprise de Test',
    address: '123 Rue Exemple, Ville Test'
}, {
    timestamps: true,
    underscored: true
});

// Définir le modèle Document mock
const DocumentMock = DBConnectionMock.define('Document', {
    id: '123e4567-e89b-12d3-a456-426614174003',
    title: 'Document de Test',
    type: 'sécurité',
    project_id: '123e4567-e89b-12d3-a456-426614174004',
    company_id: '123e4567-e89b-12d3-a456-426614174002',
    uploaded_at: new Date(),
    signedBy: [], // Définir par défaut à vide
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Définir le modèle Leave mock
const LeaveMock = DBConnectionMock.define('Leave', {
    id: '123e4567-e89b-12d3-a456-426614174006',
    user_id: '123e4567-e89b-12d3-a456-426614174000',
    type: 'congé annuel',
    start_date: '2024-12-01',
    end_date: '2024-12-10',
    description: 'Congé pour vacances',
    status: 'en attente',
    submitted_at: new Date(),
    created_at: new Date(),
    updated_at: new Date()
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Définir le modèle Notification mock
const NotificationMock = DBConnectionMock.define('Notification', {
    id: '123e4567-e89b-12d3-a456-426614174007',
    title: 'Notification de Test',
    content: 'Contenu de la notification de test',
    related_document_id: '123e4567-e89b-12d3-a456-426614174003', // Référence à DocumentMock
    user_id: '123e4567-e89b-12d3-a456-426614174000', // Référence à UserMock
    created_at: new Date(),
    is_read: false
}, {
    timestamps: false
});

// Ajouter findByPk en alias de findById
NotificationMock.findByPk = function(id) {
    return this.findById(id);
};

// Surcharger la méthode create pour inclure les validations manuelles
NotificationMock.create = function(data, options) {
    return new Promise((resolve, reject) => {
        // Valider les champs requis
        if (!data.title) {
            return reject(new Error('Validation error: title is required'));
        }
        if (!data.content) {
            return reject(new Error('Validation error: content is required'));
        }
        if (!data.user_id) {
            return reject(new Error('Validation error: user_id is required'));
        }

        // Simuler la création réussie
        resolve({
            id: '123e4567-e89b-12d3-a456-426614174007',
            title: data.title,
            content: data.content,
            related_document_id: data.related_document_id || '123e4567-e89b-12d3-a456-426614174003',
            user_id: data.user_id,
            created_at: new Date(),
            is_read: false
        });
    });
};

// Définir les associations
BlogPostMock.belongsTo(UserMock, { foreignKey: 'author_id' });
UserMock.hasMany(BlogPostMock, { foreignKey: 'author_id' });

NotificationMock.belongsTo(UserMock, { foreignKey: 'user_id' });
UserMock.hasMany(NotificationMock, { foreignKey: 'user_id' });

NotificationMock.belongsTo(DocumentMock, { foreignKey: 'related_document_id' });
DocumentMock.hasMany(NotificationMock, { foreignKey: 'related_document_id' });

module.exports = {
    sequelize: DBConnectionMock,
    User: UserMock,
    BlogPost: BlogPostMock,
    Company: CompanyMock,
    Document: DocumentMock,
    Leave: LeaveMock,
    Notification: NotificationMock
};
