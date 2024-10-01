const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Company = sequelize.define('Company', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'companies',
        timestamps: true,
        underscored: true,
    });

    Company.associate = (models) => {
        Company.hasMany(models.Project, { foreignKey: 'companyId' });
        Company.hasMany(models.User, { foreignKey: 'companyId' });
    };

    return Company;
};
