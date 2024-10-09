import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';

export class Process extends Model {
  declare id: number;
  declare description?: string | null;
  declare process_id: string;
  declare file_name: string;
  declare content_error_file_name?: string | null;
  declare question_error_file_name?: string | null;
  declare question_set_error_file_name?: string | null;
  declare status: 'open' | 'progress' | 'validated' | 'completed' | 'failed' | 'errored' | 'reopen';
  declare error_status?: string | null;
  declare error_message?: string | null;
  declare is_active: boolean;
  declare created_by: number;
  declare updated_by?: number | null;
}

Process.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Description of the process',
    },
    process_id: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Unique identifier for the process',
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Name of the file associated with the process',
    },
    content_error_file_name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Name of the content error file, if any',
    },
    question_error_file_name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Name of the question error file, if any',
    },
    question_set_error_file_name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Name of the question set error file, if any',
    },
    status: {
      type: DataTypes.ENUM('open', 'progress', 'validated', 'completed', 'failed', 'errored', 'reopen'),
      allowNull: false,
      comment: 'Current status of the process',
    },
    error_status: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Error status of the process, if any',
    },
    error_message: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Error message associated with the process, if any',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Indicates whether the process is active',
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'ID of the user who created the process',
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID of the user who last updated the process',
    },
  },
  {
    sequelize: AppDataSource,
    modelName: 'Process',
    tableName: 'process',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    comment: 'Table to store process-related data',
  },
);
