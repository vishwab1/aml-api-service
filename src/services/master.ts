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
const insertClasses = async (classData: any[]) => {
  await Promise.all(classData.map((eachClass) => insertOrUpdateEntity(classMaster, eachClass, 'name.en')));
};

//Board Data Creation
const insertBoards = async (boardData: any[]) => {
  await Promise.all(boardData.map((eachBoard) => insertOrUpdateEntity(boardMaster, eachBoard, 'name.en')));
};

//Skill Data Creation
const insertSubSkills = async (boardData: any[]) => {
  await Promise.all(boardData.map((eachSubSkill) => insertOrUpdateEntity(SubSkillMaster, eachSubSkill, 'name.en')));
};

// Main function to handle the entire insertion process
export const insertEntities = async (data: any) => {
  // Insert classes and store the mapping of class names to their IDs
  await insertClasses(_.get(data, 'classData', []));

  // Insert boards with the resolved class IDs
  await insertBoards(_.get(data, 'boardData', []));

  // Insert boards with the resolved class IDs
  await insertSubSkills(_.get(data, 'subskillData', []));
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
