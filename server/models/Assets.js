import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';


export const Asset = sequelize.define('Asset', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.STRING,
        index: true,
    },
    wallet_address:{
        type: DataTypes.STRING,
        index: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
    },
    tokens: {
        type: DataTypes.DECIMAL(10, 2),
    },
    token_price: {
        type: DataTypes.DECIMAL(10, 2),
    },
    type: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    },
    remark: {
        type: DataTypes.STRING,
    },
    level: {
        type: DataTypes.INTEGER,
    },
   
    created_at: {
        type: DataTypes.DATE
    },

    updated_at: {
        type: DataTypes.DATE
    },



}, {
    tableName: 'tbl_assets',         // 👈 Table name in your DB
    timestamps: false,           // 👈 Disable auto timestamps if you're managing them manually
    freezeTableName: true
});
