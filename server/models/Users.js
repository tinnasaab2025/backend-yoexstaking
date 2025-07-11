import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';


export const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    index:true
  },
  password: {
    type: DataTypes.STRING
  },
  sponser_id: {
    type: DataTypes.STRING,
  },
  sponser_eth_address: {
    type: DataTypes.STRING
  },
   upline_id: {
    type: DataTypes.STRING
  },
  master_key: {
    type: DataTypes.STRING
  },
  country_code: {
    type: DataTypes.STRING
  },
  name: {
    type: DataTypes.STRING
  },
  first_name: {
    type: DataTypes.STRING
  },
  last_name: {
    type: DataTypes.STRING
  },
  package_id: {
    type: DataTypes.INTEGER
  },
  bond_amount: {
    type: DataTypes.DECIMAL(10, 2)
  },
  bond_tokens: {
    type: DataTypes.DECIMAL(10, 2)
  },
  package_amount: {
    type: DataTypes.DECIMAL(10, 2)
  },
  package_tokens: {
    type: DataTypes.DECIMAL(10, 2)
  },
  total_package_tokens: {
    type: DataTypes.DECIMAL(10, 2)
  },
  bond_package_tokens: {
    type: DataTypes.DECIMAL(10, 2)
  },
  total_bond_package_tokens: {
    type: DataTypes.STRING
  },
  total_bond_amount: {
    type: DataTypes.DECIMAL(10, 2)
  },
  paid_status: {
    type: DataTypes.INTEGER
  },
  total_package: {
    type: DataTypes.DECIMAL(10, 2)
  },
  totalBonus: {
    type: DataTypes.DECIMAL(10, 2)
  },
  email: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
  eth_address: {
    type: DataTypes.STRING
  },
  country: {
    type: DataTypes.STRING
  },
  state: {
    type: DataTypes.STRING
  },
  city: {
    type: DataTypes.STRING
  },
  role: {
    type: DataTypes.STRING
  },
   created_at: {
    type: DataTypes.DATE
  },

   updated_at: {
    type: DataTypes.DATE
  },
}, {
  tableName: 'tbl_users',         // 👈 Table name in your DB
  timestamps: false,           // 👈 Disable auto timestamps if you're managing them manually
  freezeTableName: true
});
