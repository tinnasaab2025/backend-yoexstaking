import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';


export const UnBondHistory = sequelize.define('UnBondHistory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.STRING,
        index: true,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
    },
    total_unbond_tokens: {
        type: DataTypes.DECIMAL(10, 2),
    },
    bond_tokens: {
        type: DataTypes.DECIMAL(10, 2),
    },
    bond_reward_tokens: {
        type: DataTypes.DECIMAL(10, 2),
    },
    hash: {
        type: DataTypes.STRING,
    },
    unbond_at: {
        type: DataTypes.DATE,
    },
    index: {
        type: DataTypes.INTEGER,
    },
    token_price: {
        type: DataTypes.DECIMAL(10,2),
    },
   
    created_at: {
        type: DataTypes.DATE
    },

    updated_at: {
        type: DataTypes.DATE
    },

}, {
    tableName: 'tbl_unbond_history',         // 👈 Table name in your DB
    timestamps: false,           // 👈 Disable auto timestamps if you're managing them manually
    freezeTableName: true
});
