import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';

export const RewardList = sequelize.define('RewardList', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    wallet_address: {
        type: DataTypes.STRING,
        index: true,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        index: true
    },
    hash: {
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
    tableName: 'tbl_yoex_rewards',         // 👈 Table name in your DB
    timestamps: false,           // 👈 Disable auto timestamps if you're managing them manually
    freezeTableName: true
});
