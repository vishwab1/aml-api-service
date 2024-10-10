import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';

export class SkillTaxonomy extends Model {
  declare id: number;
  declare identifier: string;
  declare taxonomy_name: string;
  declare taxonomy_id: string;
  declare l1_id?: number; // Optional, as it can be null
  declare l1_identifier: string;
  declare l1_sequence?: number; // Optional, as it can be null
  declare l1_skill: { [key: string]: string }; // Adjusted for multilingual support
  declare l1_skill_description: { [key: string]: string } | null; // Adjusted for multilingual support
  declare prerequisites?: string[]; // Optional array of strings
  declare children: {
    l2_id: number;
    children: {
      l3_id: number;
      l3_skill: { [key: string]: string };
      l3_sequence: number;
      l3_identifier: string;
      l3_skill_description: { [key: string]: string } | null;
    }[];
    l2_skill: { [key: string]: string };
    l2_sequence: number;
    l2_identifier: string;
    l2_skill_description: { [key: string]: string } | null;
  }[]; // Adjusted for hierarchical structure
  declare status: 'draft' | 'live';
  declare is_active: boolean;
  declare created_by: string;
  declare updated_by?: string; // Optional, as it can be null
}

SkillTaxonomy.init(
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
    taxonomy_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    taxonomy_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    l1_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Can be null
    },
    l1_identifier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    l1_sequence: {
      type: DataTypes.INTEGER,
      allowNull: true, // Can be null
    },
    l1_skill: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    l1_skill_description: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    prerequisites: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true, // Can be null
    },
    children: {
      type: DataTypes.JSONB,
      allowNull: false,
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
      allowNull: true, // Can be null
    },
  },
  {
    sequelize: AppDataSource,
    modelName: 'SkillTaxonomy',
    tableName: 'skill_taxonomy',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
