import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';


export const BusinessRankAchivers = sequelize.define('BusinessRankAchivers', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    
    },
    rank: {
        type: DataTypes.STRING,
        index: true,
    },
    user_id: {
        type: DataTypes.STRING,
        index: true
    },
    wallet_address: {
        type: DataTypes.STRING,
    },
    total_business: {
        type: DataTypes.DECIMAL(10, 2),
    },
    first_leg_id: {
        type: DataTypes.STRING,
    },
    first_leg_wallet: {
        type: DataTypes.STRING,
    },
    first_leg_total_business: {
        type: DataTypes.DECIMAL(10, 2),
    },
    second_leg_id: {
        type: DataTypes.STRING,
    },
    second_leg_wallet: {
        type: DataTypes.STRING,
    },
    second_leg_total_business: {
        type: DataTypes.DECIMAL(10, 2),
    },
    third_leg_id: {
        type: DataTypes.STRING,
    },
    third_leg_wallet: {
        type: DataTypes.STRING,
    },
    third_leg_total_business: {
        type: DataTypes.DECIMAL(10, 2),
    },
    min_leg_amount: {
        type: DataTypes.DECIMAL(10, 2),
    },
    created_at: {
        type: DataTypes.DATE
    },

    updated_at: {
        type: DataTypes.DATE
    },

}, {
    tableName: 'tbl_business_rank_achivers',         // 👈 Table name in your DB
    timestamps: false,           // 👈 Disable auto timestamps if you're managing them manually
    freezeTableName: true
});
