const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Signature extends Model {
        static associate(models) {
            Signature.belongsTo(models.User, { foreignKey: 'user_id' });
            Signature.belongsTo(models.Document, { foreignKey: 'document_id' });
        }
    }

    Signature.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            document_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'documents',
                    key: 'id',
                },
            },
            signature_data: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            signed_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Signature',
            tableName: 'signatures',
            timestamps: false,
        }
    );

    return Signature;
};
