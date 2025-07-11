import { DataTypes } from "sequelize";
import { sequelize } from "../db/database.js";

export const Signature = sequelize.define(
  "Signature",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING,
      index: true,
    },
    wallet_address: {
      type: DataTypes.STRING,
      index: true,
    },
    package_amount: {
      type: DataTypes.DECIMAL(10, 2),
    },
    package_tokens: {
      type: DataTypes.DECIMAL(10, 2),
    },
    enter_amount: {
      type: DataTypes.DECIMAL(10, 2),
    },
    enter_tokens: {
      type: DataTypes.STRING,
    },
    token_price: {
      type: DataTypes.STRING,
    },
    signature: {
      type: DataTypes.STRING,
    },
    nonce: {
      type: DataTypes.INTEGER,
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
    tableName: "tbl_signature", // 👈 Table name in your DB
    timestamps: false, // 👈 Disable auto timestamps if you're managing them manually
    freezeTableName: true,
  }
);
