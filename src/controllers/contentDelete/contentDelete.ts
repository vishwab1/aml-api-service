import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import { deleteContentByIdentifier, getContentById } from '../../services/content'; // Adjust import path as needed
import { amlError } from '../../types/amlError';
import httpStatus from 'http-status';
import { ResponseHandler } from '../../utils/responseHandler';

export const apiId = 'api.content.delete';

const deleteContentById = async (req: Request, res: Response) => {
  const contentId = _.get(req, 'params.content_id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  // Fetch content details by identifier
  const contentDetails = await getContentById(contentId, { is_active: true });

  // Validate if content exists
  if (_.isEmpty(contentDetails)) {
    const code = 'CONTENT_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Content not exists` });
    throw amlError(code, 'Content not exists', 'NOT_FOUND', httpStatus.NOT_FOUND);
  }

  // Delete the content
  await deleteContentByIdentifier(contentId);

  logger.info({ apiId, msgid, resmsgid, contentId, message: 'Content deleted successfully' });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Content deleted successfully' } });
};

export default deleteContentById;
