/**
 * ce modèle de document est utilisé pour stocker les informations sur les signatures.
 * 
 * Il est utilisé pour effectuer des opérations de base de données sur la table des signatures.
 */
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

class Signature extends Model {}

Signature.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    document_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'documents',
            key: 'id'
        }
    },
    signature_data: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    signed_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Signature',
    tableName: 'signatures',
    timestamps: false
});

module.exports = Signature;
