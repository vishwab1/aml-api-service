import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import tenantCreateJson from './createTenantValidationSchema.json';
import { errorResponse, successResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { createTenant } from '../../services/tenant';
import { schemaValidation } from '../../services/validationService';
import * as uuid from 'uuid';
import { getBoardsByIds } from '../../services/board';

export const apiId = 'api.tenant.create';

const tenantCreate = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const dataBody = _.get(req, 'body.request');
  try {
    //validating the schema
    const isRequestValid: Record<string, any> = schemaValidation(requestBody, tenantCreateJson);
    if (!isRequestValid.isValid) {
      const code = 'TENANT_INVALID_INPUT';
      logger.error({ code, apiId, msgid, requestBody, message: isRequestValid.message });
      return res.status(httpStatus.BAD_REQUEST).json(errorResponse(apiId, msgid, httpStatus.BAD_REQUEST, isRequestValid.message, code));
    }

    if (dataBody.board_id && dataBody.board_id.length > 0) {
      const { boards } = await getBoardsByIds(dataBody.board_id);

      //handle databse error
      if (boards.error) {
        throw new Error(boards.message);
      }
      if (boards.length !== dataBody.board_id.length) {
        const code = 'BOARD_NOT_FOUND';
        logger.error({ code, apiId, msgid, requestBody, message: 'board IDs do not exist' });
        return res.status(httpStatus.BAD_REQUEST).json(errorResponse(apiId, msgid, httpStatus.BAD_REQUEST, 'Board IDs do not exist', code));
      }
    }

    const tenantInsertData = {
      ...dataBody,
      identifier: uuid.v4(),
      status: 'live',
      created_by: 'system',
      is_active: true,
    };

    const createNewTenant = await createTenant(tenantInsertData);

    return res.status(httpStatus.OK).json(successResponse(apiId, msgid, { message: 'Tenant Successfully Created', identifier: createNewTenant.identifier }));
  } catch (error: any) {
    const code = _.get(error, 'code') || 'TENANT_CREATE_FAILURE';
    let errorMessage = error;
    const statusCode = _.get(error, 'statusCode', 500);
    if (!statusCode || statusCode == 500) {
      errorMessage = { code, message: error.message };
    }
    logger.error({ error, apiId, code, errorMessage });
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(apiId, msgid, statusCode, errorMessage, code));
  }
};

export default tenantCreate;
