import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import { ResponseHandler } from '../../utils/responseHandler';
import { amlError } from '../../types/amlError';
import httpStatus from 'http-status';
import { getPresignedUrl } from '../../services/awsService';
import { getProcessById } from '../../services/process';
import { appConfiguration } from '../../config';
import { ProcessStatus } from '../../enums/status';

const { bulkUploadFolder } = appConfiguration;
export const apiId = 'api.bulk.status';

const bulkUploadStatus = async (req: Request, res: Response) => {
  const process_id = _.get(req, 'params.process_id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  const process = await getProcessById(process_id);

  if (process.errors) {
    const code = 'SERVER_ERROR';
    logger.error({ code, apiId, msgid, resmsgid, message: process });
    throw amlError(code, process, 'INTERNAL_SERVER_ERROR', 500);
  }

  if (_.isEmpty(process.getProcess)) {
    const code = 'PROCESS_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `process not exists` });
    throw amlError(code, 'process not exists', 'NOT_FOUND', 404);
  }

  const {
    getProcess: { file_name, status, error_message, content_error_file_name, question_error_file_name, question_set_error_file_name, error_status },
  } = process;

  const validStatuses = [ProcessStatus.COMPLETED, ProcessStatus.OPEN, ProcessStatus.VALIDATED, ProcessStatus.PROGRESS, ProcessStatus.REOPEN, ProcessStatus.COMPLETED];

  if (validStatuses.includes(status)) {
    logger.info({ apiId, msgid, resmsgid, message: `process retrieved successfully` });
    return ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { status, error_status } });
  }

  const filesToSign = [content_error_file_name, question_error_file_name, question_set_error_file_name].filter(Boolean);
  let signedUrls;
  if (filesToSign.length > 0) {
    signedUrls = await Promise.all(
      filesToSign.map(async (file) => {
        const getSignedUrl = await getPresignedUrl(`${bulkUploadFolder}/${process_id}/${file}`);
        if (getSignedUrl.error) {
          const code = 'SERVER_ERROR';
          logger.error({ code, apiId, msgid, resmsgid, message: getSignedUrl.message });
          throw amlError(code, getSignedUrl.message, 'INTERNAL_SERVER_ERROR', 500);
        }
        return { fileName: file, url: getSignedUrl.url, expiresInSec: getSignedUrl.expiresInSec };
      }),
    );
  }

  logger.info({ apiId, msgid, resmsgid, message: `signed url created successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { signedUrls, status, error_message, error_status, file_name } });
};

export default bulkUploadStatus;
