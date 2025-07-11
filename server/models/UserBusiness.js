import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';


export const UserBusiness = sequelize.define('UserBusiness', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    index: true
  },
  sponser_id: {
    type: DataTypes.STRING,
  },
  wallet_address: {
    type: DataTypes.STRING,
  },
  sponser_wallet_address: {
    type: DataTypes.STRING
  },
  available_asset: {
    type: DataTypes.DECIMAL(10, 2)
  },
  total_asset: {
    type: DataTypes.DECIMAL(10, 2)
  },
  stake_amount: {
    type: DataTypes.DECIMAL(10, 2)
  },
  total_unstake_tokens: {
    type: DataTypes.DECIMAL(10, 2)
  },
  total_stake_amount: {
    type: DataTypes.DECIMAL(10, 2)
  },
  stake_tokens: {
    type: DataTypes.DECIMAL(10, 2)
  },
  total_stake_tokens: {
    type: DataTypes.DECIMAL(10, 2)
  },
  bond_amount: {
    type: DataTypes.DECIMAL(10, 2)
  },
  bond_tokens: {
    type: DataTypes.DECIMAL(10, 2)
  },
  bond_discount_tokens: {
    type: DataTypes.DECIMAL(10, 2)
  },
  total_bond_amount: {
    type: DataTypes.DECIMAL(10, 2)
  },
  bond_tokens: {
    type: DataTypes.DECIMAL(10, 2)
  },
  total_bond_tokens: {
    type: DataTypes.DECIMAL(10, 2)
  },
  yoex_bond_yield: {
    type: DataTypes.DECIMAL(10, 2)
  },
  bond_infinity_yield_rewards: {
    type: DataTypes.DECIMAL(10, 2)
  },
  yield_loop_rewards: {
    type: DataTypes.DECIMAL(10, 2)
  },
  infinity_yield_rewards: {
    type: DataTypes.DECIMAL(10, 2)
  },
  stake_yield: {
    type: DataTypes.DECIMAL(10, 2)
  },
  bond_yield: {
    type: DataTypes.DECIMAL(10, 2)
  }, team_business: {
    type: DataTypes.DECIMAL(10, 2)
  }, total_team_business: {
    type: DataTypes.DECIMAL(10, 2)
  }, team_business_tokens: {
    type: DataTypes.DECIMAL(10, 2)
  }, total_team_business_tokens: {
    type: DataTypes.DECIMAL(10, 2)
  }, direct_business: {
    type: DataTypes.DECIMAL(10, 2)
  }, total_direct_business: {
    type: DataTypes.DECIMAL(10, 2)
  },
  direct_business_tokens: {
    type: DataTypes.DECIMAL(10, 2)
  },
  total_direct_business_tokens: {
    type: DataTypes.DECIMAL(10, 2)
  },
  participant_status: {
    type: DataTypes.INTEGER
  },
  available_tokens: {
    type: DataTypes.DECIMAL(10, 2)
  },
  total_tokens: {
    type: DataTypes.DECIMAL(10, 2)
  },

  created_at: {
    type: DataTypes.DATE
  },

  updated_at: {
    type: DataTypes.DATE
  },
}, {
  tableName: 'tbl_users_business',         // 👈 Table name in your DB
  timestamps: false,           // 👈 Disable auto timestamps if you're managing them manually
  freezeTableName: true
});
