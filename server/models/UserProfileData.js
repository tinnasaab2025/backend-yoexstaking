import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';

export const UserProfileData = sequelize.define(
  'UserProfileData',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING,
    },
    wallet_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
    },
    region: {
      type: DataTypes.STRING,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    number: {
      type: DataTypes.STRING,
    },
    pan_number: {
      type: DataTypes.STRING,
    },
    passport_number: {
      type: DataTypes.STRING,
    },
    pan_image: {
      type: DataTypes.STRING,
    },
    passport_front: {
      type: DataTypes.STRING,
    },
    passport_back: {
      type: DataTypes.STRING,
    },
    passport_photo: {
      type: DataTypes.STRING,
    },
    date_of_issue: {
      type: DataTypes.DATEONLY,
    },
    date_of_expiry: {
      type: DataTypes.DATEONLY,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'tbl_profile',
    timestamps: false,
    freezeTableName: true,
    indexes: [
      { fields: ['country'] },
      { fields: ['region'] },
    ],
  }
);
