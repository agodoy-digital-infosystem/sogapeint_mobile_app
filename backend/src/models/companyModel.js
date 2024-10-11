/**
 * Ce modèle définit le schéma de la table des entreprises dans la base de données.
 * 
 * Il est utilisé pour effectuer des opérations de base de données sur la table des entreprises.
 */
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

class Company extends Model {}

Company.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Company',
    tableName: 'companies',
    timestamps: true,
    underscored: true
});

module.exports = Company;
