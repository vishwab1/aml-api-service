import _ from 'lodash';
import { SkillTaxonomy } from '../models/skillTaxonomy';
import { Op } from 'sequelize';
import { Status } from '../enums/status';
import * as uuid from 'uuid';

// Create skill taxonomy service
export const createSkillTaxonomyData = async (req: { [key: string]: any }[]): Promise<any> => {
  const createdSkillTaxonomies = await SkillTaxonomy.bulkCreate(req, { returning: true });
  // Return dataValues of created records
  return createdSkillTaxonomies.map(({ dataValues }) => dataValues);
};

// Get skill taxonomy by id
export const getSkillTaxonomyId = async (skill_taxonomy_id: number): Promise<any> => {
  const skillTaxonomy = await SkillTaxonomy.findOne({
    where: { id: skill_taxonomy_id, status: Status.LIVE, is_active: true },
    raw: true,
  });
  return { skillTaxonomy };
};

// Function to validate skill_taxonomy_id
export const checkSkillTaxonomyIdsExists = async (skillTaxonomyIds: number[] | null) => {
  const skillTaxonomyId = await SkillTaxonomy.findAll({
    where: { id: { [Op.in]: skillTaxonomyIds } },
    raw: true,
  });

  const existingIds = _.map(skillTaxonomyId, 'id');
  const missingTaxonomyIds = _.difference(skillTaxonomyIds, existingIds);

  // If there are no missing IDs, return true, else return false
  return _.isEmpty(missingTaxonomyIds);
};

// Helper function to get skill ID from multilingual input
const getSkillId = (skill: any, skillMap: Map<string, number>): number | undefined => {
  for (const lang in skill) {
    const name = skill[lang];
    const skillId = skillMap.get(name.toLowerCase());
    if (skillId) {
      return skillId;
    }
  }
  return undefined; // Return undefined if no match found
};

// Function to process L3 skills
const processL3Skills = async (children: any[], skillMap: Map<string, number>) => {
  return await Promise.all(
    children.map((subchild: any) => {
      const l3SkillId = getSkillId(subchild.l3_skill, skillMap);
      if (!l3SkillId) throw new Error(`L3 skill not found`);

      return { ...subchild, l3_id: l3SkillId }; // Add L3 ID to subchild
    }),
  );
};

// Function to process L2 skills
const processL2Skills = async (children: any[], skillMap: Map<string, number>) => {
  return await Promise.all(
    children.map(async (child: any) => {
      const l2SkillId = getSkillId(child.l2_skill, skillMap);
      if (!l2SkillId) throw new Error(`L2 skill not found`);

      const childrenWithL3Ids = _.get(child, 'children') ? await processL3Skills(_.get(child, 'children', []), skillMap) : []; // Process L3 if present

      return { ...child, l2_id: l2SkillId, children: childrenWithL3Ids }; // Add L2 ID to child
    }),
  );
};

// Main function to process L1 skills and taxonomy
export const processSkillTaxonomy = async (dataBody: any[], skillMap: Map<string, number>): Promise<any[]> => {
  return await Promise.all(
    dataBody.map(async (taxonomy: any) => {
      const l1SkillId = getSkillId(taxonomy.l1_skill, skillMap);
      if (!l1SkillId) throw new Error(`L1 skill not found`);

      const childrenWithL2Ids = _.get(taxonomy, 'children') ? await processL2Skills(_.get(taxonomy, 'children', []), skillMap) : []; // Process L2 if present

      return {
        ...taxonomy,
        identifier: uuid.v4(),
        status: Status.LIVE,
        created_by: 'system',
        is_active: true,
        l1_id: l1SkillId, // Add L1 ID
        children: childrenWithL2Ids, // Add children if present
      };
    }),
  );
};

//filter taxonmy
export const getSkillTaxonomySearch = async (req: Record<string, any>) => {
  const limit: any = _.get(req, 'limit');
  const offset: any = _.get(req, 'offset');
  const { filters = {} } = req || {};

  const whereClause: any = {};

  whereClause.status = Status.LIVE;
  whereClause.is_active = true;

  if (filters.l1_skill) {
    whereClause.l1_skill = {
      [Op.or]: filters.l1_skill.map((termObj: any) => {
        const [key, value] = Object.entries(termObj)[0];
        return {
          [key]: { [Op.iLike]: `%${String(value)}%` },
        };
      }),
    };
  }

  if (filters.l2_skill) {
    whereClause[Op.or] = filters.l2_skill.map((termObj: any) => {
      const [key, value] = Object.entries(termObj)[0];
      return {
        children: {
          [Op.contains]: [
            {
              l2_skill: {
                [key]: value,
              },
            },
          ],
        },
      };
    });
  }

  if (filters.l3_skill) {
    whereClause[Op.or] = filters.l3_skill.map((termObj: any) => {
      const [key, value] = Object.entries(termObj)[0];

      return {
        children: {
          [Op.contains]: [
            {
              children: [
                {
                  l3_skill: {
                    [key]: value,
                  },
                },
              ],
            },
          ],
        },
      };
    });
  }

  const skillTaxonomies = await SkillTaxonomy.findAll({
    limit: limit || 100,
    offset: offset || 0,
    where: whereClause,
    attributes: { exclude: ['id'] },
  });
  return skillTaxonomies;
};
