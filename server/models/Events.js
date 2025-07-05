import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';


export const Event = sequelize.define('Event', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    first_name:{
        type: DataTypes.STRING
    },
    last_name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    wallet_address: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.TINYINT,
    },
   
    created_at: {
        type: DataTypes.DATE
    },

    updated_at: {
        type: DataTypes.DATE
    },



}, {
    tableName: 'tbl_events',         // 👈 Table name in your DB
    timestamps: false,           // 👈 Disable auto timestamps if you're managing them manually
    freezeTableName: true
});
