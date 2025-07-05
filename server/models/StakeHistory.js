import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';


export const StakeHistory = sequelize.define('StakeHistory', {
     id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.STRING,
        index: true,
    },
    wallet_address: {
        type: DataTypes.STRING,
    },
    tokens: {
        type: DataTypes.DECIMAL(10, 2),
    },
    usdt_amount: {
        type: DataTypes.DECIMAL(10, 2),
    },
    hash: {
        type: DataTypes.STRING,
    },
    token_price: {
        type: DataTypes.DECIMAL(10, 2),
    },
    timestamp_unix: {
        type: DataTypes.INTEGER,
    },
    timestamp_utc: {
        type: DataTypes.DATE,
    },
    timestamp_india: {
        type: DataTypes.DATE,
    },
    created_at: {
        type: DataTypes.DATE
    },

    updated_at: {
        type: DataTypes.DATE
    },



}, {
    tableName: 'tbl_stake_history',         // 👈 Table name in your DB
    timestamps: false,           // 👈 Disable auto timestamps if you're managing them manually
    freezeTableName: true
});
