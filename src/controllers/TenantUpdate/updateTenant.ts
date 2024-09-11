import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { getTenant, updateTenant } from '../../services/tenant';
import { schemaValidation } from '../../services/validationService';
import logger from '../../utils/logger';
import tenantUpdateJson from './updateTenatValidationSchema.json';
import { getBoards } from '../../services/board';
import { ResponseHandler } from '../../utils/responseHandler';
import { amlError } from '../../types/AmlError';

export const apiId = 'api.tenant.update';

const tenantUpdate = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');
  const tenant_id = _.get(req, 'params.tenant_id');
  const dataBody = _.get(req, 'body.request');

  const isRequestValid = schemaValidation(requestBody, tenantUpdateJson);
  if (!isRequestValid.isValid) {
    const code = 'TENANT_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  // Validate tenant existence
  const { tenant } = await getTenant(tenant_id);
  if (_.isEmpty(tenant)) {
    const code = 'TENANT_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: 'Tenant does not exist' });
    throw amlError(code, 'Tenant does not exists', 'NOT_FOUND', 404);
  }

  // Validate boards
  const { boards } = await getBoards(dataBody.board_id);

  if (boards.length !== dataBody.board_id.length) {
    const code = 'BOARD_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: 'Some boards does not exist' });
    throw amlError(code, 'Board do not exists', 'NOT_FOUND', 404);
  }

  // Update the tenant
  await updateTenant(tenant_id, dataBody);

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Tenant Successfully Updated' } });
};

export default tenantUpdate;
