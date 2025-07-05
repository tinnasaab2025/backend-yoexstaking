import { DataTypes } from 'sequelize';
import { sequelize } from '../DB/database.js';


export const RewardBusiness = sequelize.define('RewardBusiness', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    available_rewards: {
        type: DataTypes.DECIMAL(10, 2),
        index: true,
    },
    total_rewards:{
        type: DataTypes.DECIMAL(10, 2),
        index: true
    },
    created_at: {
        type: DataTypes.DATE
    },

    updated_at: {
        type: DataTypes.DATE
    },



}, {
    tableName: 'tbl_rewards_business',         // 👈 Table name in your DB
    timestamps: false,           // 👈 Disable auto timestamps if you're managing them manually
    freezeTableName: true
});
