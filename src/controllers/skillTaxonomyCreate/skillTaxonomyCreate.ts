import { Request, Response } from 'express';
import * as _ from 'lodash';
import skillTaxonomyCreateJson from './createSkillTaxonomyValidationSchema.json';
import httpStatus from 'http-status';
import { createSkillTaxonomyData, processSkillTaxonomy } from '../../services/skillTaxonomy';
import { schemaValidation } from '../../services/validationService';
import { ResponseHandler } from '../../utils/responseHandler';
import { amlError } from '../../types/amlError';
import logger from '../../utils/logger';
import { fetchSkillIds } from '../../services/skill';

export const apiId = 'api.skillTaxonomy.create';

//Function for the taxonomy create
const createSkillTaxonomy = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const dataBody = _.get(req, 'body.request');
  const resmsgid = _.get(res, 'resmsgid');

  // Validating the schema
  const isRequestValid: Record<string, any> = schemaValidation(requestBody, skillTaxonomyCreateJson);
  if (!isRequestValid.isValid) {
    const code = 'SKILL_TAXONOMY_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  const skillMap = await fetchSkillIds(); // Assuming this fetches skill IDs as numbers

  // Process the skill taxonomy data
  const insertedskillTaxonomyData = await processSkillTaxonomy(dataBody, skillMap);

  // Insert skill taxonomies into the database
  const createdSkillTaxonomies = await createSkillTaxonomyData(insertedskillTaxonomyData);

  // Extract identifiers
  const identifiers = createdSkillTaxonomies.map((taxonomy: any) => taxonomy.identifier);

  logger.info({ apiId, requestBody, message: `Skill Taxonomy Successfully Created` });

  ResponseHandler.successResponse(req, res, {
    status: httpStatus.OK,
    data: {
      message: 'Skill Taxonomy Successfully Created',
      identifier: identifiers,
    },
  });
};

export default createSkillTaxonomy;
