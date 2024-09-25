import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { schemaValidation } from '../../services/validationService';
import logger from '../../utils/logger';
import masterSearchJson from './searchMasterValidationSchema.json';
import { getEntitySearch } from '../../services/master';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';

export const apiId = 'api.master.search';

//Function for master search
export const masterSearch = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  // Validate the request body against the schema
  const isRequestValid = schemaValidation(requestBody, masterSearchJson);
  if (!isRequestValid.isValid) {
    const code = 'MASTER_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  // Perform the search based on the entity type and filters
  let searchData = await getEntitySearch(requestBody.request);

  if (searchData.errors) {
    const code = 'SERVER_ERROR';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: searchData });
    throw amlError(code, searchData, 'INTERNAL_SERVER_ERROR', 500);
  }

  searchData = _.map(searchData, (data: any) => {
    return data?.dataValues;
  });

  logger.info({ apiId, requestBody, message: `Search completed successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: searchData });
};
