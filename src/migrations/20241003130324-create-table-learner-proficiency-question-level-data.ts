import { QueryInterface, DataTypes } from 'sequelize';

const tableName = 'learner_proficiency_question_level_data';

export = {
  /**
   * Write code here for migration.
   *
   * @param queryInterface
   */
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      identifier: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      learner_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      question_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      question_set_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      taxonomy: {
        allowNull: true,
        type: DataTypes.JSONB,
      },
      sub_skills: {
        allowNull: true,
        type: DataTypes.JSONB,
      },
      score: {
        allowNull: false,
        type: DataTypes.DOUBLE,
      },
      attempts_count: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      created_by: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      updated_by: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },

  /**
   * Write code here for migration rollback.
   *
   * @param queryInterface
   */
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable(tableName);
  },
};
