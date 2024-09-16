import { boardMaster } from '../models/boardMaster';
import { classMaster } from '../models/classMaster';
import { SubSkillMaster } from '../models/subSkillMaster';
import { Status } from '../enums/status';
import { Op } from 'sequelize';
import * as uuid from 'uuid';
import _ from 'lodash';

// Helper function to insert or update an entity
const insertOrUpdateEntity = async (model: any, entity: any, uniqueKey: string) => {
  const existingEntity = await model.findOne({
    where: { [uniqueKey]: _.get(entity, uniqueKey) },
    raw: true,
  });

  if (_.isNil(existingEntity)) {
    // Insert new entity if it doesn't exist
    await model.create({
      ...entity,
      identifier: uuid.v4(),
      status: Status.LIVE,
      is_active: true,
      created_by: 'manual',
    });
  }
};

//Class Data Creation
const handleClassInsertion = async (classData: any[]) => {
  if (_.isEmpty(classData)) return [];

  // Insert or update class data
  await Promise.all(classData.map((cls) => insertOrUpdateEntity(classMaster, cls, 'name.en')));

  // Retrieve only the 'name' field from the inserted class data
  const classRecords = await classMaster.findAll({
    attributes: ['name'], // Select only the 'name' field
    raw: true,
  });

  return classRecords;
};

//Board Creation
const handleBoardInsertion = async (boardData: any[], classMap: any[]) => {
  if (_.isEmpty(boardData)) return;

  // Create a lookup map for class names to IDs from classMap
  const classLookup = _.reduce(
    classMap,
    (acc, { name }) => {
      _.forEach(_.values(name), (value) => {
        if (value) acc[value] = name;
      });
      return acc;
    },
    {} as Record<string, any>,
  );

  await Promise.all(
    _.map(boardData, async (board) => {
      const classNames = _.get(board, 'class_names', []);
      const classIds = _.compact(
        _.map(classNames, (classObj) => {
          const name = _.find(_.values(classObj), (name) => classLookup[name]);
          return name || null; // Return the class name, not ID
        }),
      );

      // Check if all class names are found
      if (classIds.length !== classNames.length) {
        throw new Error(`One or more classes not found for board`);
      }

      // Insert or update the board data
      await insertOrUpdateEntity(boardMaster, board, 'name.en');
    }),
  );
};

// Function to handle insertion of other entities (subskills, roles)
const handleOtherEntitiesInsertion = async (entityMappings: any[]) => {
  await Promise.all(
    _.map(entityMappings, async ({ model, data, uniqueKey }) => {
      if (!_.isEmpty(data)) {
        await Promise.all(
          _.map(data, async (entity) => {
            await insertOrUpdateEntity(model, entity, uniqueKey);
          }),
        );
      }
    }),
  );
};

// Main function to handle the entire insertion process
export const insertEntities = async (data: any) => {
  // Insert classes and store the mapping of class names to their IDs
  const classMap = await handleClassInsertion(_.get(data, 'classData', []));

  // Insert boards with the resolved class IDs
  await handleBoardInsertion(_.get(data, 'boardData', []), classMap);

  // Insert other entities (subskills, roles)
  const entityMappings = [{ model: SubSkillMaster, data: _.get(data, 'subskillData', []), uniqueKey: 'name' }];

  await handleOtherEntitiesInsertion(entityMappings);
};

export const getEntitySearch = async (req: Record<string, any>) => {
  const { entityType, filters = {}, limit = 100, offset = 0 } = req;

  const modelMappings: Record<string, any> = {
    subSkill: SubSkillMaster,
    class: classMaster,
    board: boardMaster,
  };

  const model = modelMappings[entityType];

  if (!model) {
    throw new Error('Invalid entity type');
  }

  const whereClause: any = {
    status: 'live',
    is_active: true,
  };

  // Handle JSONB filters
  if (filters.name) {
    whereClause['name'] = {
      [Op.contains]: filters.name,
    };
  }

  const data = await model.findAll({ limit: limit || 100, offset: offset || 0, ...(whereClause && { where: whereClause }), attributes: { exclude: ['id'] } });

  return data;
};
