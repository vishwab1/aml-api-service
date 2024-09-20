import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import { ResponseHandler } from '../../utils/responseHandler';
import { amlError } from '../../types/AmlError';
import httpStatus from 'http-status';
import { getQuestionSignedUrl } from '../../services/awsService';
import { getProcessById } from '../../services/process';

export const apiId = 'api.upload.status';

const uploadStatus = async (req: Request, res: Response) => {
  const process_id = _.get(req, 'params.process_id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  const process = await getProcessById(process_id);

  const {
    getProcess: { fileName, status, error_message, error_status },
  } = process;

  if (process.error) {
    throw new Error(process.message);
  }

  //validating process is exist
  if (_.isEmpty(process.getProcess)) {
    const code = 'PROCESS_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `process not exists` });
    throw amlError(code, 'Tenant not exists', 'NOT_FOUND', 404);
  }

  //signed url for upload question
  const getSignedUrl = await getQuestionSignedUrl(`upload/${process_id}/${fileName}`);

  if (!getSignedUrl) {
    throw new Error(getSignedUrl);
  }

  const { url } = getSignedUrl;
  logger.info({ apiId, msgid, resmsgid, message: `signed url created successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { url, status, error_message, error_status, fileName } });
};

export default uploadStatus;
