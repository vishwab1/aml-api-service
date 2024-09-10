import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import { errorResponse, successResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { getTenant } from '../../services/tenant';
import * as uuid from 'uuid';

export const apiId = 'api.tenant.read';

const ReadSingleTenant = async (req: Request, res: Response) => {
  const tenant_id = _.get(req, 'params.tenant_id');
  const msgid = _.get(req, ['body', 'params', 'msgid'], uuid.v4());
  const resmsgid = _.get(res, 'resmsgid', uuid.v4());

  return getTenant(tenant_id)
    .then(({ tenant }) => {
      if (_.isEmpty(tenant)) {
        // Tenant not found
        const code = 'TENANT_NOT_EXISTS';
        logger.error({ code, apiId, message: `Tenant does not exist` });
        return Promise.reject({ code, message: 'Tenant does not exist', statusCode: httpStatus.NOT_FOUND });
      }

      // Return success response
      logger.info({ apiId, message: `Tenant Read Successfully` });
      return res.status(httpStatus.OK).json(successResponse(apiId, msgid, resmsgid, tenant));
    })
    .catch((error: any) => {
      const code = _.get(error, 'code', 'TENANT_READ_FAILURE');
      const statusCode = _.get(error, 'statusCode', httpStatus.INTERNAL_SERVER_ERROR);
      const errorMessage = statusCode === httpStatus.INTERNAL_SERVER_ERROR ? { code, message: error.message } : error;

      logger.error({ error, apiId, code, tenant_id });
      if (!res.headersSent) {
        res.status(statusCode).json(errorResponse(apiId, msgid, resmsgid, statusCode, errorMessage, code));
      }
    });
};

export default ReadSingleTenant;
