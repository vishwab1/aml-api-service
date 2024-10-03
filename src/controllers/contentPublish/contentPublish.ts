import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { getContentById, publishContentById } from '../../services/content';
import { amlError } from '../../types/amlError';
import { Status } from '../../enums/status';
import { ResponseHandler } from '../../utils/responseHandler';

export const apiId = 'api.content.publish';

const publishContent = async (req: Request, res: Response) => {
  const contentId = _.get(req, 'params.content_id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  // Fetch the content details
  const contentDetails = await getContentById(contentId, { status: Status.DRAFT });

  // Validate content existence
  if (_.isEmpty(contentDetails)) {
    const code = 'CONTENT_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Content not exists` });
    throw amlError(code, 'Content not exists', 'NOT_FOUND', httpStatus.NOT_FOUND);
  }

  // Publish the content
  await publishContentById(contentId);

  // Log success
  logger.info({ apiId, contentId, message: 'Content published successfully' });

  // Send success response

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Content successfully published' } });
};

export default publishContent;
