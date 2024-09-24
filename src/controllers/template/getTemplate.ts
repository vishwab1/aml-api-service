import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import { ResponseHandler } from '../../utils/responseHandler';
import httpStatus from 'http-status';
import { getPresignedUrl } from '../../services/awsService';
import { amlError } from '../../types/AmlError';
import { appConfiguration } from '../../config';

const { templateFolder } = appConfiguration;

export const apiId = 'api.bulk.template';

const getTemplate = async (req: Request, res: Response) => {
  const fileName = _.get(req, 'params.fileName');
  const getTemplatefile = await getPresignedUrl(`${templateFolder}/${fileName}`);
  if (getTemplatefile.error) {
    const code = 'SERVER_ERROR';
    logger.error({ code, apiId, message: getTemplatefile.message });
    throw amlError(code, getTemplatefile.message, 'INTERNAL_SERVER_ERROR', 500);
  }

  const { url } = getTemplatefile;
  logger.info({ apiId, fileName, message: `signed url created successfully ` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { url, fileName } });
};

export default getTemplate;
