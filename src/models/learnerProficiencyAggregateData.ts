import { DataTypes } from 'sequelize';
import { AppDataSource } from '../config';

export const LearnerProficiencyAggregateData = AppDataSource.define(
  'learner_proficiency_aggregate_data',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    identifier: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    learner_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    class: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    l1_skill: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    l2_skill: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    l3_skill: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    taxonomy: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    sub_skills: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    questions_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
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
    tableName: 'learner_proficiency_aggregate_data',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
