/**
 * Ce modèle définit le schéma de la table des documents dans la base de données.
 * 
 * Il est utilisé pour effectuer des opérations de base de données sur la table des documents.
 */
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

class Document extends Model {}

Document.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: [['sécurité', 'livret d\'accueil']]
        }
    },
    project_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'projects',
            key: 'id'
        }
    },
    company_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'companies',
            key: 'id'
        }
    },
    uploaded_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    signedBy: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        defaultValue: []
    }
}, {
    sequelize,
    modelName: 'Document',
    tableName: 'documents',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Document;
