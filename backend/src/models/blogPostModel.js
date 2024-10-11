/**
 * ce modèle de document est utilisé pour stocker les informations sur les documents
 * dans l'application.
 * 
 * Il est utilisé pour effectuer des opérations de base de données sur la table des documents.
 */
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

class BlogPost extends Model {}

BlogPost.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    author_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'BlogPost',
    tableName: 'blog_posts',
    timestamps: false
});

module.exports = BlogPost; // Export the BlogPost model
