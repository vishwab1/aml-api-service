import { SubSkillMaster } from '../models/subSkillMaster'; // The model file

// Update a sub-skill
export const updateSubSkillData = async (subSkillId: string, data: any): Promise<any> => {
  const whereClause: Record<string, any> = { identifier: subSkillId, is_active: true };
  const updatedSubSkill = await SubSkillMaster.update(data, { where: whereClause });
  return { updatedSubSkill };
};

// Get a sub-skill by ID
export const getSubSkill = async (subSkillId: string): Promise<any> => {
  const subSkill = await SubSkillMaster.findOne({
    where: { identifier: subSkillId, is_active: true },
    attributes: { exclude: ['id'] },
  });

  return { subSkill };
};
