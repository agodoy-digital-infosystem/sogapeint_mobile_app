/**
 * @file userModel.js
 * @description Defines the User model for the Sogapeint application using Sequelize ORM.
 */

const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

module.exports = (sequelize) => {
    class User extends Model {
        /**
         * Compare a candidate password with the hashed password stored in the database.
         * @param {string} candidatePassword - The plain text password to compare.
         * @returns {Promise<boolean>} - Returns true if the passwords match, false otherwise.
         */
        async comparePassword(candidatePassword) {
            return await bcrypt.compare(candidatePassword, this.password);
        }

        /**
         * Generate a secure password reset token and set its expiration time.
         * @returns {string} - The generated password reset token.
         */
        generatePasswordResetToken() {
            const buffer = crypto.randomBytes(32);
            const token = buffer.toString('hex');
            this.passwordResetToken = token;
            this.passwordResetExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
            return token;
        }

        /**
         * Clear the password reset token and its expiration time.
         */
        clearPasswordResetToken() {
            this.passwordResetToken = null;
            this.passwordResetExpires = null;
        }
    }

    User.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            firstName: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            lastName: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            role: {
                type: DataTypes.STRING(50),
                allowNull: false,
                validate: {
                    isIn: [['Admin', 'Manager', 'Collaborateur', 'User']],
                },
            },
            companyId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'companies',
                    key: 'id',
                },
            },
            projectIds: {
                type: DataTypes.ARRAY(DataTypes.UUID),
                allowNull: false,
                defaultValue: [],
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            passwordResetToken: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            passwordResetExpires: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            timestamps: true,
            hooks: {
                /**
                 * Hash the user's password before saving to the database.
                 * @param {User} user - The user instance being saved.
                 */
                beforeSave: async (user) => {
                    if (user.changed('password')) {
                        const salt = await bcrypt.genSalt(10);
                        user.password = await bcrypt.hash(user.password, salt);
                    }
                },
            },
        }
    );

    return User;
};
