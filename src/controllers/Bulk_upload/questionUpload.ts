import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import * as uuid from 'uuid';
import { ResponseHandler } from '../../utils/responseHandler';
import { amlError } from '../../types/AmlError';
import httpStatus from 'http-status';
import { schemaValidation } from '../../services/validationService';
import templateSchema from './questionUploadSchema.json';
import { uploadUrl } from '../../services/awsService';
import { createProcess } from '../../services/process';

export const apiId = 'api.upload.zip';

const getUploadQuestionUrl = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const fileName = _.get(req, 'body.request');
  const resmsgid = _.get(res, 'resmsgid');

  //validating the schema
  const isRequestValid: Record<string, any> = schemaValidation(requestBody, templateSchema);
  if (!isRequestValid.isValid) {
    const code = 'UPLOAD_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  const process_id = uuid.v4();

  const getSignedUrl = await uploadUrl(process_id, fileName);
  if (!getSignedUrl) {
    throw new Error(getSignedUrl);
  }
  const insertProcess = await createProcess({
    process_id: process_id,
    fileName: fileName,
    status: 'open',
    is_active: true,
    created_by: 1,
  });
  if (!insertProcess) {
    throw new Error(insertProcess);
  }
  const { message, url } = getSignedUrl;
  logger.info({ apiId, requestBody, message: `signed url for upload question created successfully ` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message, url, fileName, process_id } });
};

export default getUploadQuestionUrl;
