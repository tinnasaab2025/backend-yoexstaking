import { DataTypes } from 'sequelize';
import { sequelize } from '../DB/database.js';


export const TokenPrice = sequelize.define('TokenPrice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
   amount: {
    type: DataTypes.STRING,
    index:true
  },
  sellValue: {
    type: DataTypes.STRING,
  },
  market_cap: {
    type: DataTypes.DECIMAL(10, 2),
  },
  symbol: {
    type: DataTypes.DECIMAL(10, 2),
  },
   supply: {
    type: DataTypes.DECIMAL(10, 2),
  },
   created_at: {
    type: DataTypes.DATE
  },

   updated_at: {
    type: DataTypes.DATE
  },
 


}, {
  tableName: 'tbl_token_value',         // 👈 Table name in your DB
  timestamps: false,           // 👈 Disable auto timestamps if you're managing them manually
  freezeTableName: true
});
