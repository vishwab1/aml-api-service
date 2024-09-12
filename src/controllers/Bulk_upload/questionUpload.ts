import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import * as uuid from 'uuid';
import { ResponseHandler } from '../../utils/responseHandler';
import { amlError } from '../../types/AmlError';
import httpStatus from 'http-status';
import { schemaValidation } from '../../services/validationService';
import templateSchema from './questionUploadSchema.json';
import { uploadSignedUrl } from '../../services/awsService';
import { createProcess } from '../../services/process';

export const apiId = 'api.upload.question';

const uploadQuestion = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const dataBody = _.get(req, 'body.request');
  const resmsgid = _.get(res, 'resmsgid');
  const { folderName, fileName, description, expiryTime } = dataBody;

  //validating the schema
  const isRequestValid: Record<string, any> = schemaValidation(requestBody, templateSchema);
  if (!isRequestValid.isValid) {
    const code = 'UPLOAD_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  //creating process id
  const process_id = uuid.v4();

  //signed url for upload question
  const getSignedUrl = await uploadSignedUrl(folderName, process_id, fileName, expiryTime);

  if (!getSignedUrl) {
    throw new Error(getSignedUrl);
  }
  const insertProcess = await createProcess({
    process_id: process_id,
    fileName: fileName,
    status: 'open',
    description,
    is_active: true,
    created_by: 1,
  });
  if (!insertProcess) {
    throw new Error(insertProcess);
  }
  const { message, url } = getSignedUrl;
  logger.info({ apiId, requestBody, message: `signed url created successfully ` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message, url, fileName, process_id } });
};

export default uploadQuestion;
