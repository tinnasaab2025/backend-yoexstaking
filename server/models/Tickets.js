import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';


export const Ticket = sequelize.define('Ticket', {
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
    topic_id: {
        type: DataTypes.INTEGER,
    },
    subject: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    },
     status: {
        type: DataTypes.STRING,
    },

    created_at: {
        type: DataTypes.DATE
    },

    updated_at: {
        type: DataTypes.DATE
    },



}, {
    tableName: 'tbl_tickets',         // 👈 Table name in your DB
    timestamps: false,           // 👈 Disable auto timestamps if you're managing them manually
    freezeTableName: true
});
