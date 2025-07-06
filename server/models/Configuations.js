import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';

export const Configuration = sequelize.define('Configuration', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    setting_key: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique identifier for the setting'
    },
    setting_value: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Current value (string, JSON, etc.)'
    },
    setting_type: {
        type: DataTypes.ENUM('boolean', 'integer', 'string', 'json'),
        allowNull: false,
        defaultValue: 'string',
        comment: 'Type hint for value parsing'
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'What this setting controls'
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Optional grouping (e.g. feature_toggle)'
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
    tableName: 'tbl_configuations',
    timestamps: false, // Since you're manually managing timestamps
    freezeTableName: true
});
