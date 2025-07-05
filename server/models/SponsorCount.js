import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';


export const SponsorCount = sequelize.define('SponsorCount', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.STRING,
        index: true,
    },
    downline_id: {
        type: DataTypes.STRING,
        index: true
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
    tableName: 'tbl_sponser_count',         // 👈 Table name in your DB
    timestamps: false,           // 👈 Disable auto timestamps if you're managing them manually
    freezeTableName: true
});
