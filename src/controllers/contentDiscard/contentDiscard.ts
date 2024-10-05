import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { discardContentByIdentifier, getContentById } from '../../services/content'; // Adjust import path as needed
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';

export const apiId = 'api.content.discard';

const discardContentById = async (req: Request, res: Response) => {
  const contentId = _.get(req, 'params.content_id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  // Fetch content details by identifier
  const contentDetails = await getContentById(contentId);

  // Validate if content exists
  if (_.isEmpty(contentDetails)) {
    const code = 'CONTENT_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Content not exists` });
    throw amlError(code, 'Content not exists', 'NOT_FOUND', httpStatus.NOT_FOUND);
  }

  // Discard (hard delete) the content
  await discardContentByIdentifier(contentId);

  logger.info({ apiId, msgid, resmsgid, contentId, message: 'Content discarded successfully' });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Content discarded successfully' } });
};

export default discardContentById;
