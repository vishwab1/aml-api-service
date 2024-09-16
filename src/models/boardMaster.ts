import { DataTypes } from 'sequelize';
import { AppDataSource } from '../config';

export const boardMaster = AppDataSource.define(
  'board_master',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    identifier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    description: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('draft', 'live'),
      allowNull: false,
    },
    class_names: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'board_master',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
