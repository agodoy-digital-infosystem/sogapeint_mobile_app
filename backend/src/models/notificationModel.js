/**
 * Ce modèle définit le schéma de la table des notifications dans la base de données.
 * 
 * Il est utilisé pour effectuer des opérations de base de données sur la table des notifications.
 */
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

class Notification extends Model {}

Notification.init({
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
    related_document_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'documents',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: false
});

module.exports = Notification;
