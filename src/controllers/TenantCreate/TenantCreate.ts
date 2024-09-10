import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import tenantCreateJson from './createTenantValidationSchema.json';
import { errorResponse, successResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { createTenant } from '../../services/tenant';
import { schemaValidation } from '../../services/validationService';
import * as uuid from 'uuid';
import { getBoards } from '../../services/board';
import { Status } from '../../enums/status';

export const apiId = 'api.tenant.create';

const tenantCreate = (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body', {});
  const msgid = _.get(req, ['body', 'params', 'msgid'], uuid.v4());
  const dataBody = _.get(req, 'body.request', {});
  const resmsgid = _.get(res, 'resmsgid', uuid.v4());

  // Validate the schema
  const isRequestValid = schemaValidation(requestBody, tenantCreateJson);
  if (!isRequestValid.isValid) {
    const code = 'TENANT_INVALID_INPUT';
    logger.error({ code, msgid, requestBody, message: isRequestValid.message });
    return res.status(httpStatus.BAD_REQUEST).json(errorResponse(apiId, msgid, resmsgid, httpStatus.BAD_REQUEST, isRequestValid.message, code));
  }

  // Retrieve boards and handle potential errors
  getBoards(dataBody.board_id)
    .then(({ boards }) => {
      if (boards.length !== dataBody.board_id.length) {
        const code = 'BOARD_NOT_FOUND';
        logger.error({ code, msgid, requestBody, message: 'Board does not exist' });
        return Promise.reject({ code, message: 'Board does not exist' });
      }

      // Prepare tenant data and create the tenant
      const tenantInsertData = {
        ...dataBody,
        identifier: uuid.v4(),
        status: Status.LIVE,
        created_by: 'system',
        is_active: true,
      };

      return createTenant(tenantInsertData);
    })
    .then(({ dataValues }) => {
      return res.status(httpStatus.OK).json(successResponse(apiId, msgid, resmsgid, { message: 'Tenant Successfully Created', identifier: dataValues.identifier }));
    })
    .catch((error: any) => {
      const code = _.get(error, 'code', 'TENANT_CREATE_FAILURE');
      const statusCode = _.get(error, 'statusCode', httpStatus.INTERNAL_SERVER_ERROR);
      const errorMessage = statusCode === httpStatus.INTERNAL_SERVER_ERROR ? { code, message: error.message } : error;

      logger.error({ error, code, errorMessage });
      if (!res.headersSent) {
        res.status(statusCode).json(errorResponse(apiId, msgid, resmsgid, statusCode, errorMessage, code));
      }
    });
};

export default tenantCreate;
