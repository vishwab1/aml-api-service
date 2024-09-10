import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { getTenant, updateTenant } from '../../services/tenant';
import { schemaValidation } from '../../services/validationService';
import logger from '../../utils/logger';
import { errorResponse, successResponse } from '../../utils/response';
import tenantUpdateJson from './updateTenatValidationSchema.json';
import * as uuid from 'uuid';
import { getBoards } from '../../services/board';

export const apiId = 'api.tenant.update';

const tenantUpdate = (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid'], uuid.v4());
  const resmsgid = _.get(res, 'resmsgid', uuid.v4());
  const tenant_id = _.get(req, 'params.tenant_id');
  const dataBody = _.get(req, 'body.request');

  // Validate the update schema
  const isRequestValid = schemaValidation(requestBody, tenantUpdateJson);
  if (!isRequestValid.isValid) {
    const code = 'TENANT_INVALID_INPUT';
    logger.error({ code, apiId, requestBody, message: isRequestValid.message });
    return res.status(httpStatus.BAD_REQUEST).json(errorResponse(apiId, msgid, resmsgid, httpStatus.BAD_REQUEST, isRequestValid.message, code));
  }

  // Validate tenant existence
  return getTenant(tenant_id)
    .then(({ tenant }) => {
      if (_.isEmpty(tenant)) {
        const code = 'TENANT_NOT_EXISTS';
        logger.error({ code, apiId, message: 'Tenant does not exist' });
        return Promise.reject({ code, message: 'Tenant does not exist', statusCode: httpStatus.NOT_FOUND });
      }

      // Validate boards
      return getBoards(dataBody.board_id).then(({ boards }) => {
        if (boards.length !== dataBody.board_id.length) {
          const code = 'BOARD_NOT_FOUND';
          logger.error({ code, apiId, msgid, requestBody, message: 'Some boards do not exist' });
          return Promise.reject({ code, message: 'Some boards do not exist' });
        }

        // Update the tenant
        return updateTenant(tenant_id, dataBody).then(() => {
          return res.status(httpStatus.OK).json(successResponse(apiId, msgid, resmsgid, { message: 'Tenant Successfully Updated' }));
        });
      });
    })
    .catch((error: any) => {
      const code = _.get(error, 'code', 'TENANT_UPDATE_FAILURE');
      const statusCode = _.get(error, 'statusCode', httpStatus.INTERNAL_SERVER_ERROR);
      const errorMessage = statusCode === httpStatus.INTERNAL_SERVER_ERROR ? { code, message: error.message } : error;

      logger.error({ error, code, apiId, requestBody });
      if (!res.headersSent) {
        return res.status(statusCode).json(errorResponse(apiId, msgid, resmsgid, statusCode, errorMessage, code));
      }
    });
};

export default tenantUpdate;
