import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';


export const Reward = sequelize.define('Reward', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.STRING,
        index: true,
    },
    rank_id:{
        type: DataTypes.INTEGER,
        index: true
    },
    rank_name: {
        type: DataTypes.STRING,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
    },
    payable_amount: {
        type: DataTypes.DECIMAL(10, 2),
    },
     teamA: {
        type: DataTypes.DECIMAL(10, 2),
    },
     teamB: {
        type: DataTypes.DECIMAL(10, 2),
    },
     teamC: {
        type: DataTypes.DECIMAL(10, 2),
    },
   
    created_at: {
        type: DataTypes.DATE
    },

    updated_at: {
        type: DataTypes.DATE
    },



}, {
    tableName: 'tbl_rewards',         // 👈 Table name in your DB
    timestamps: false,           // 👈 Disable auto timestamps if you're managing them manually
    freezeTableName: true
});
