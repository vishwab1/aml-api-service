import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import { ResponseHandler } from '../../utils/responseHandler';
import httpStatus from 'http-status';
import { templateUrl } from '../../services/awsService';

export const apiId = 'api.get.template';

const getTemplate = async (req: Request, res: Response) => {
  const fileName = _.get(req, 'params.fileName');
  const getTemplatefile = await templateUrl(fileName);
  if (!getTemplatefile) {
    throw new Error(getTemplatefile);
  }
  const { url } = getTemplatefile;
  logger.info({ apiId, fileName, message: `signed url created successfully ` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { url, fileName } });
};

export default getTemplate;
