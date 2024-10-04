import { DataTypes } from 'sequelize';
import { AppDataSource } from '../config';

export const LearnerProficiencyQuestionSetLevelData = AppDataSource.define(
  'learner_proficiency_question_set_level_data',
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
    question_set_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    taxonomy: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    sub_skills: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    attempts_count: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 1,
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
    tableName: 'learner_proficiency_question_set_level_data',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
