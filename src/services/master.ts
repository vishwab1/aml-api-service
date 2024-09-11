import { boardMaster } from '../models/boardMaster';
import { classMaster } from '../models/classMaster';
import { skillMaster } from '../models/skillMaster';
import { subSkillMaster } from '../models/subSkillMaster';
import { roleMaster } from '../models/roleMaster';
import { Status } from '../enums/status';

export const insertEntities = async (data: any) => {
  const entityMappings = [
    { model: boardMaster, data: data.boardData, uniqueKey: 'name' },
    { model: classMaster, data: data.classData, uniqueKey: 'name' },
    { model: skillMaster, data: data.skillData, uniqueKey: 'name' },
    { model: subSkillMaster, data: data.subskillData, uniqueKey: 'name' },
    { model: roleMaster, data: data.roleData, uniqueKey: 'name' },
  ];

  const insertEntities = async (model: any, entities: any[], uniqueKey: string) => {
    await Promise.all(
      entities.map(async (entity) => {
        const exists = await model.findOne({ where: { [uniqueKey]: entity[uniqueKey] }, raw: true });
        if (!exists) {
          await model.create({ ...entity, status: Status.LIVE, is_active: true, created_by: 'manual' });
        }
      }),
    );
  };

  await Promise.all(entityMappings.map(({ model, data, uniqueKey }) => data && insertEntities(model, data, uniqueKey)));
};

export const getEntitySearch = async (req: Record<string, any>) => {
  const { entityType, filters = {}, limit = 100, offset = 0 } = req;

  const modelMappings: Record<string, any> = {
    skill: skillMaster,
    subskill: subSkillMaster,
    role: roleMaster,
    class: classMaster,
    board: boardMaster,
  };

  const model = modelMappings[entityType];

  if (!model) {
    throw new Error('Invalid entity type');
  }

  const data = await model.findAll({
    limit,
    offset,
    where: filters,
  });

  return data;
};
