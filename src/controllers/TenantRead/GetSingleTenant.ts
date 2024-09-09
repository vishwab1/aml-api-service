import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import { errorResponse, successResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { getTenant } from '../../services/tenant';

export const apiId = 'api.tenant.read';

const ReadSingleTenant = async (req: Request, res: Response) => {
  const tenant_id = parseInt(_.get(req, 'params.tenant_id'));
  const msgid = _.get(req, ['body', 'params', 'msgid']);

  try {
    const getTenantInfo = await getTenant(tenant_id);

    //handle databse error
    if (getTenantInfo.error) {
      throw new Error(getTenantInfo.message);
    }

    const tenantDetails = getTenantInfo.tenant;

    //validating tenant is exist
    if (_.isEmpty(tenantDetails)) {
      const code = 'TENANT_NOT_EXISTS';
      logger.error({ code, apiId, message: `Tenant not exists` });
      return res.status(httpStatus.NOT_FOUND).json(errorResponse(apiId, msgid, httpStatus.NOT_FOUND, `Tenant does not exists `, code));
    }

    logger.info({ apiId, message: `Tenant Read Successfully` });
    res.status(httpStatus.OK).json(successResponse(apiId, msgid, tenantDetails));
  } catch (error: any) {
    const code = _.get(error, 'code') || 'TENANT_READ_FAILURE';
    let errorMessage = error;
    const statusCode = _.get(error, 'statusCode', 500);
    if (!statusCode || statusCode == 500) {
      errorMessage = { code, message: error.message };
    }
    logger.error({ error, apiId, code, tenant_id });
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(apiId, msgid, statusCode, errorMessage, code));
  }
};

export default ReadSingleTenant;
