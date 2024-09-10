import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { getTenantSearch } from '../../services/tenant';
import { schemaValidation } from '../../services/validationService';
import logger from '../../utils/logger';
import { errorResponse, successResponse } from '../../utils/response';
import * as uuid from 'uuid';
import tenantSearchJson from './searchTenantValidationSchema.json';

export const apiId = 'api.tenant.search';

const tenantSearch = (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body', {});
  const msgid = _.get(req, ['body', 'params', 'msgid'], uuid.v4());
  const resmsgid = _.get(res, 'resmsgid', uuid.v4());

  // Validate the request body
  const isRequestValid = schemaValidation(requestBody, tenantSearchJson);
  if (!isRequestValid.isValid) {
    const code = 'TENANT_INVALID_INPUT';
    logger.error({ code, apiId, requestBody, message: isRequestValid.message });
    return res.status(httpStatus.BAD_REQUEST).json(errorResponse(apiId, msgid, resmsgid, httpStatus.BAD_REQUEST, isRequestValid.message, code));
  }

  // Search for tenants
  return getTenantSearch(requestBody.request)
    .then((tenantData) => {
      const formattedData = _.map(tenantData, (data: any) => data?.dataValues);

      logger.info({ apiId, requestBody, message: `Tenants are searched successfully` });
      return res.status(httpStatus.OK).json(successResponse(apiId, msgid, resmsgid, formattedData));
    })
    .catch((error: any) => {
      const code = _.get(error, 'code', 'TENANT_SEARCH_FAILURE');
      const statusCode = _.get(error, 'statusCode', httpStatus.INTERNAL_SERVER_ERROR);
      const errorMessage = statusCode === httpStatus.INTERNAL_SERVER_ERROR ? { code, message: error.message } : error;

      logger.error({ error, apiId, code, requestBody });
      if (!res.headersSent) {
        return res.status(statusCode).json(errorResponse(apiId, msgid, resmsgid, statusCode, errorMessage, code));
      }
    });
};

export default tenantSearch;
