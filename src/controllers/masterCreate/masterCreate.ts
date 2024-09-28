import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { insertMasterData } from '../../services/master';
import { schemaValidation } from '../../services/validationService';
import masterCreateJson from './createMasterValidationSchema.json';
import logger from '../../utils/logger';
import { ResponseHandler } from '../../utils/responseHandler';
import { amlError } from '../../types/amlError';

export const apiId = 'api.master.create';

//function to create master data
export const createMaster = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const dataBody = _.get(req, 'body.request');
  const resmsgid = _.get(res, 'resmsgid');

  // Validate the request body against the schema
  const isRequestValid: Record<string, any> = schemaValidation(requestBody, masterCreateJson);
  if (!isRequestValid.isValid) {
    const code = 'MASTER_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  const insertedMasterData = await insertMasterData(dataBody);

  if (insertedMasterData.errors) {
    const code = 'SERVER_ERROR';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: insertedMasterData });
    throw amlError(code, insertedMasterData, 'INTERNAL_SERVER_ERROR', 500);
  }

  // Check if totalInserted is zero
  if (insertedMasterData.totalInserted === 0) {
    ResponseHandler.successResponse(req, res, {
      status: httpStatus.OK,
      data: { message: 'Master Data was not inserted', totalInserted: insertedMasterData.totalInserted, details: insertedMasterData.details },
    });
  } else {
    ResponseHandler.successResponse(req, res, {
      status: httpStatus.OK,
      data: { message: 'Master Data Successfully Added', totalInserted: insertedMasterData.totalInserted, details: insertedMasterData.details },
    });
  }
};
