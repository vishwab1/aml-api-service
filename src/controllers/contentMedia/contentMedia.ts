import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import { ResponseHandler } from '../../utils/responseHandler';
import { amlError } from '../../types/amlError';
import httpStatus from 'http-status';
import { schemaValidation } from '../../services/validationService';
import contentMediaSchema from './contentMediaSchema.json';
import { getPresignedUrl } from '../../services/awsService';
import { getContentMediaById } from '../../services/content';

export const apiId = 'api.contentMedia.read';

const getContentMediaReadURL = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const dataBody = _.get(req, 'body.request');
  const resmsgid = _.get(res, 'resmsgid');

  const isRequestValid: Record<string, any> = schemaValidation(requestBody, contentMediaSchema);
  if (!isRequestValid.isValid) {
    const code = 'MEDIA_CONTENT_READ_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', httpStatus.BAD_REQUEST);
  }

  const contentsMedia = await getContentMediaById(dataBody);

  if (_.isEmpty(contentsMedia)) {
    const code = 'MEDIA_NOT_EXIST';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: 'Media not found for the given content id' });
    throw amlError(code, 'Media not found for the given content id', 'NOT_FOUND', httpStatus.NOT_FOUND);
  }
  const signedUrls = await Promise.all(
    contentsMedia.media.map(async (media: any) => {
      const getSignedUrl = await getPresignedUrl(`${media.src}/${media.file_name}`);
      if (getSignedUrl.error) {
        const code = 'SERVER_ERROR';
        logger.error({ code, apiId, msgid, resmsgid, message: getSignedUrl.message });
        throw amlError(code, getSignedUrl.message, 'INTERNAL_SERVER_ERROR', httpStatus.INTERNAL_SERVER_ERROR);
      }
      return {
        media,
        url: getSignedUrl.url,
        expiresInSec: getSignedUrl.expiresInSec,
      };
    }),
  );

  logger.info({ apiId, requestBody, message: `signed urls for media upload created successfully ` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'success', signedUrls } });
};

export default getContentMediaReadURL;
