import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { getSkillTaxonomySearch } from '../../services/skillTaxonomy';
import { schemaValidation } from '../../services/validationService';
import logger from '../../utils/logger';
import tenantSearchJson from './searchSkillTaxonomyValidationSchema.json';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';

export const apiId = 'api.skillTaxonomy.search';

//Function for the taxonomy search
const skillTaxonomySearch = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  const isRequestValid = schemaValidation(requestBody, tenantSearchJson);
  if (!isRequestValid.isValid) {
    const code = 'SKILL_TAXONOMY_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  // Search for taxonomy
  const taxonomyData = await getSkillTaxonomySearch(requestBody.request);
  const filteredData = _.map(taxonomyData, (data: any) => data?.dataValues);

  logger.info({ apiId, requestBody, message: `Taxonomy are searched successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: filteredData });
};

export default skillTaxonomySearch;
