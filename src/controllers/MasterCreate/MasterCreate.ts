import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { insertEntities } from '../../services/master';
import { schemaValidation } from '../../services/validationService';
import masterCreateJson from './createMasterValidationSchema.json';
import logger from '../../utils/logger';
import { ResponseHandler } from '../../utils/responseHandler';
import { amlError } from '../../types/AmlError';

export const apiId = 'api.master.create';

export const masterCreate = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const dataBody = _.get(req, 'body.request');
  const resmsgid = _.get(res, 'resmsgid');

  const isRequestValid: Record<string, any> = schemaValidation(requestBody, masterCreateJson);
  if (!isRequestValid.isValid) {
    const code = 'MASTER_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  await insertEntities(dataBody);

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Master Data Successfully Added' } });
};
