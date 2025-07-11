import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';


export const Income = sequelize.define('Income', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
   user_id: {
    type: DataTypes.STRING,
    index:true
  },
  wallet_address: {
    type: DataTypes.STRING,
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
  remarl: {
    type: DataTypes.STRING,
  },
   level: {
    type: DataTypes.INTEGER,
  },


}, {
  tableName: 'tbl_assets',         // 👈 Table name in your DB
  timestamps: false,           // 👈 Disable auto timestamps if you're managing them manually
  freezeTableName: true
});
