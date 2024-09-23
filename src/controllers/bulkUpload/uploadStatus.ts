import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import { ResponseHandler } from '../../utils/responseHandler';
import { amlError } from '../../types/AmlError';
import httpStatus from 'http-status';
import { bulkUploadUrl } from '../../services/awsService';
import { getProcessById } from '../../services/process';

export const apiId = 'api.upload.status';

const bulkUploadStatus = async (req: Request, res: Response) => {
  const process_id = _.get(req, 'params.process_id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  const process = await getProcessById(process_id);

  const {
    getProcess: { fileName, status, error_message, error_status },
  } = process;

  if (!process) {
    const code = 'SERVER_ERROR';
    logger.error({ code, apiId, msgid, resmsgid, message: process });
    throw amlError(code, process, 'INTERNAL_SERVER_ERROR', 500);
  }

  if (_.isEmpty(process.getProcess)) {
    const code = 'PROCESS_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `process not exists` });
    throw amlError(code, 'process not exists', 'NOT_FOUND', 404);
  }

  const getSignedUrl = await bulkUploadUrl(`upload/${process_id}/${fileName}`);

  if (!getSignedUrl) {
    const code = 'SERVER_ERROR';
    logger.error({ code, apiId, msgid, resmsgid, message: getSignedUrl });
    throw amlError(code, getSignedUrl, 'INTERNAL_SERVER_ERROR', 500);
  }

  const { url } = getSignedUrl;
  logger.info({ apiId, msgid, resmsgid, message: `signed url created successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { url, status, error_message, error_status, fileName } });
};

export default bulkUploadStatus;
