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

  const getProcessinfo = await getProcessById(process_id);

  const {
    getProcess: { fileName, status, error_message, error_status, name },
  } = getProcessinfo;

  //handle databse error
  if (getProcessinfo.error) {
    throw new Error(getProcessinfo.message);
  }

  //validating process is exist
  if (_.isEmpty(getProcessinfo.getProcess)) {
    const code = 'PROCESS_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `process not exists` });
    throw amlError(code, 'Tenant not exists', 'NOT_FOUND', 404);
  }

  //signed url for upload question
  const folderpath = `upload/${process_id}`;
  const getSignedUrl = await getQuestionSignedUrl(folderpath, fileName, 5);
  const { url } = getSignedUrl;

  logger.info({ apiId, msgid, resmsgid, message: `signed url created successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { url, status, error_message, error_status, fileName, name } });
};

export default uploadStatus;
