import { DataTypes } from 'sequelize';
import { sequelize } from '../DB/database.js';


export const BondHistory = sequelize.define('BondHistory', {
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
    total_bond: {
        type: DataTypes.DECIMAL(10, 2),
    },
    bond_tokens: {
        type: DataTypes.DECIMAL(10, 2),
    },
    bond_principles: {
        type: DataTypes.DECIMAL(10, 2),
    },
    total_release_bond: {
        type: DataTypes.DECIMAL(10, 2),
    },
    token_price: {
        type: DataTypes.DECIMAL(10, 2),
        index: true
    },
    lock_days: {
        type: DataTypes.INTEGER,
    },
    days: {
        type: DataTypes.INTEGER,
    },
    unbond_id: {
        type: DataTypes.INTEGER,
    },
    unbond_time: {
        type: DataTypes.DATE,
    },
    hash: {
        type: DataTypes.STRING,
    },
    wallet_address: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.INTEGER,
    },
    created_at: {
        type: DataTypes.DATE
    },

    updated_at: {
        type: DataTypes.DATE
    },



}, {
    tableName: 'tbl_bond_history',         // 👈 Table name in your DB
    timestamps: false,           // 👈 Disable auto timestamps if you're managing them manually
    freezeTableName: true
});
