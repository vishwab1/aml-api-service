import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
// import * as uuid from 'uuid';
import { ResponseHandler } from '../../utils/responseHandler';
import { amlError } from '../../types/AmlError';
import httpStatus from 'http-status';
import { schemaValidation } from '../../services/validationService';
import templateSchema from './templateSchema.json';
import { getTemplateSignedUrl } from '../../services/awsService';

export const apiId = 'api.get.template';

const getTemplate = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const dataBody = _.get(req, 'body.request');
  const resmsgid = _.get(res, 'resmsgid');
  const { folderName, fileName, expiryTime } = dataBody;

  //validating the schema
  const isRequestValid: Record<string, any> = schemaValidation(requestBody, templateSchema);
  if (!isRequestValid.isValid) {
    const code = 'TEMPLATE_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  //signed url for downlaod template
  const getSignedUrl = await getTemplateSignedUrl(folderName, fileName, expiryTime);

  if (!getSignedUrl) {
    throw new Error(getSignedUrl);
  }

  const { url } = getSignedUrl;

  logger.info({ apiId, requestBody, message: `signed url created successfully ` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { url, fileName } });
};

export default getTemplate;
