import { DataTypes, Model } from 'sequelize';
import { AppDataSource } from '../config';

export class boardMaster extends Model {
  declare id: number;
  declare identifier: string;
  declare name: { [key: string]: string };
  declare class_ids: {
    ids: number[];
    l1_skill_ids: number[];
  } | null;
  declare skill_taxonomy_id: string | null;
  declare description: { [key: string]: string } | null;
  declare status: 'draft' | 'live';
  declare is_active: boolean;
  declare created_by: string;
  declare updated_by: string | null;
}

boardMaster.init(
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
    class_ids: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    skill_taxonomy_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('draft', 'live'),
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
    sequelize: AppDataSource,
    modelName: 'boardMaster',
    tableName: 'board_master',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
