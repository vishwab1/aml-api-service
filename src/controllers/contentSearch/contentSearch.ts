import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import questionSearch from './contentSearchValidationSchema.json';
import { schemaValidation } from '../../services/validationService';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';
import { getContentList } from '../../services/content';

export const apiId = 'api.content.search';

export const searchContents = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  const isRequestValid: Record<string, any> = schemaValidation(requestBody, questionSearch);
  if (!isRequestValid.isValid) {
    const code = 'CONTENT_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  // Replace questionSetData with content
  let content = await getContentList(requestBody.request);
  content = _.map(content, (data: any) => {
    return data?.dataValues;
  });

  logger.info({ apiId, requestBody, message: `Content is listed successfully` });

  // Update the response to return content instead of questionSetData
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: content });
};
