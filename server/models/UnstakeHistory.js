import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';

export const UnstakeHistory = sequelize.define('UnstakeHistory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
    },
    wallet_address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    tokens: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    hash: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    token_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'tbl_unstake_history',
    timestamps: false, // manually handling timestamps
    freezeTableName: true,
    indexes: [
        {
            name: 'user_id',
            fields: ['user_id', 'tokens']
        }
    ]
});
