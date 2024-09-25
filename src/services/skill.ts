import { SkillMaster } from '../models/skill';

export async function fetchSkillIds(): Promise<Map<string, number>> {
  // Fetch skills with the relevant attributes
  const skills = await SkillMaster.findAll({
    attributes: ['id', 'name'],
  });

  // Create a map to hold name-to-id mappings for case-insensitive lookups
  const skillMap = new Map<string, number>();

  // Iterate over fetched skills and populate the map
  for (const skill of skills) {
    const skillId = skill.dataValues.id; // Access id directly from dataValues
    const names = skill.dataValues.name; // Access name directly from dataValues

    // Ensure names is an object and populate the map
    if (typeof names === 'object' && names !== null) {
      Object.values(names).forEach((name) => {
        // Check if name is a string
        if (typeof name === 'string') {
          skillMap.set(name.toLowerCase(), skillId); // Lowercased key for case-insensitive matching
        }
      });
    }
  }

  return skillMap;
}
// Get skill by ID
export const getSkillById = async (skillId: string): Promise<any> => {
  const skill = await SkillMaster.findOne({
    where: { identifier: skillId, is_active: true, status: 'live' },
    attributes: { exclude: ['created_at', 'updated_at'] },
  });

  return skill;
};

// Update skill
export const updateSkillData = async (skillId: string, req: any): Promise<any> => {
  const whereClause = { identifier: skillId, is_active: true, status: 'live' };
  const updatedSkill = await SkillMaster.update(req, { where: whereClause });
  return { updatedSkill };
};
