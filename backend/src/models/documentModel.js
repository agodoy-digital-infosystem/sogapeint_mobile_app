'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    /**
     * Initialize associations.
     * @param {Object} models - The Sequelize models.
     */
    static associate(models) {
      Document.belongsTo(models.Project, { foreignKey: 'project_id' });
      Document.belongsTo(models.Company, { foreignKey: 'company_id' });
      Document.belongsToMany(models.User, {
        through: models.Signature,
        foreignKey: 'document_id',
        otherKey: 'user_id'
      });
    }

    /**
     * Initialize a Document instance from JSON.
     * @param {Object} json - The JSON object.
     * @returns {Document} - The Document instance.
     */
    static fromJson(json) {
      return Document.build(json);
    }

    /**
     * Convert a Document instance to JSON.
     * @returns {Object} - The JSON representation of the Document.
     */
    toJson() {
      return this.get({ plain: true });
    }

    /**
     * Mark the document as signed by a user.
     * @param {String} userId - The ID of the user signing the document.
     * @returns {Promise<Document>} - The updated Document instance.
     */
    async markAsSigned(userId) {
      if (!this.signedBy.includes(userId)) {
        this.signedBy.push(userId);
        await this.save();
      }
      return this;
    }
  }

  Document.init(
    {
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
    },
    {
      sequelize,
      modelName: 'Document',
      tableName: 'documents',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  return Document;
};
