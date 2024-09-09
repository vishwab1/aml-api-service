import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { getTenantSearch } from '../../services/tenant';
import { schemaValidation } from '../../services/validationService';
import logger from '../../utils/logger';
import { errorResponse, successResponse } from '../../utils/response';

import tenantSearchJson from './searchTenantValidationSchema.json';

export const apiId = 'api.tenant.search';

const tenantSearch = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);

  try {
    const isRequestValid = schemaValidation(requestBody, tenantSearchJson);
    if (!isRequestValid.isValid) {
      const code = 'TENANT_INVALID_INPUT';
      return res.status(400).json(errorResponse(apiId, msgid, httpStatus.NOT_FOUND, isRequestValid.message, code));
    }
    let tenantData = await getTenantSearch(requestBody.request);
    tenantData = _.map(tenantData, (data: any) => {
      return data?.dataValues;
    });
    logger.info({ apiId, requestBody, message: `Tenants are Searched successfully` });
    res.status(httpStatus.OK).json(successResponse(apiId, msgid, tenantData));
  } catch (error: any) {
    const code = _.get(error, 'code') || 'TENANT_SEARCH_FAILURE';
    let errorMessage = error;
    const statusCode = _.get(error, 'statusCode', 500);
    if (!statusCode || statusCode == 500) {
      errorMessage = { code, message: error.message };
    }
    logger.error({ error, apiId, code, errorMessage });
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(apiId, msgid, statusCode, errorMessage, code));
  }
};

export default tenantSearch;
