import { Status } from '../enums/status';
import { SubSkillMaster } from '../models/subSkillMaster'; // The model file
import { amlError } from '../types/amlError';

// Update a sub-skill
export const updateSubSkillData = async (subSkillId: string, data: any): Promise<any> => {
  const existingSubSkill = await SubSkillMaster.findOne({
    where: { identifier: subSkillId, status: Status.LIVE, is_active: true },
    raw: true,
  });

  if (!existingSubSkill) {
    const code = 'SUBSKILL_NOT_FOUND';
    throw amlError(code, 'Sub-skill not found.', 'NOT_FOUND', 404);
  }

  const updatedData = {
    ...existingSubSkill,
    ...data,
  };

  await SubSkillMaster.update(updatedData, {
    where: { identifier: subSkillId },
  });

  return updatedData;
};

// Get a sub-skill by ID
export const getSubSkill = async (subSkillId: string): Promise<any> => {
  const subSkill = await SubSkillMaster.findOne({
    where: { identifier: subSkillId, is_active: true },
    attributes: { exclude: ['id'] },
  });

  return subSkill?.dataValues;
};
