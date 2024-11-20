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

// Définir les associations si nécessaire
BlogPostMock.belongsTo(UserMock, { foreignKey: 'author_id' });
UserMock.hasMany(BlogPostMock, { foreignKey: 'author_id' });

module.exports = {
    sequelize: DBConnectionMock,
    User: UserMock,
    BlogPost: BlogPostMock
};
