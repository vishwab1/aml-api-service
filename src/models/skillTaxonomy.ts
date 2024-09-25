import { DataTypes } from 'sequelize';
import { AppDataSource } from '../config';

export const SkillTaxonomy = AppDataSource.define(
  'skill_taxonomy',
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
    l1_id: {
      type: DataTypes.INTEGER,
    },
    l1_identifier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    l1_sequence: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    l1_skill: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    l1_skill_description: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    children: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('draft', 'live'),
      allowNull: false,
      defaultValue: 'draft',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    tableName: 'skill_taxonomy',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
