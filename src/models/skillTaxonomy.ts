import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';

export class SubSkillMaster extends Model {
  declare id: number;
  declare identifier: string;
  declare name: { [key: string]: string };
  declare description?: { [key: string]: string } | null;
  declare status: 'draft' | 'live';
  declare is_active: boolean;
  declare created_by: string;
  declare updated_by?: string | null;
}

SubSkillMaster.init(
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
      unique: true,
      comment: 'Multilingual field for skill name',
    },
    description: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'A short description of the skill',
    },
    status: {
      type: DataTypes.ENUM('draft', 'live'),
      allowNull: false,
      comment: 'The status of the sub-skill',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Indicates whether the sub-skill is active or not',
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'The user who created this sub-skill',
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'The user who last updated this sub-skill',
    },
  },
  {
    sequelize: AppDataSource,
    modelName: 'SubSkillMaster',
    tableName: 'sub_skill_master',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    comment: 'Table to store sub-skill related data',
  },
);
