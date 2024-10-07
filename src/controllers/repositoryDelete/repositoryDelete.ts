import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import { deleteRepositoryByIdentifier, getRepositoryById } from '../../services/repository'; // Adjust import path as needed
import { amlError } from '../../types/amlError';
import httpStatus from 'http-status';
import { ResponseHandler } from '../../utils/responseHandler';

export const apiId = 'api.repository.delete';

const deleteRepositoryById = async (req: Request, res: Response) => {
  const repository_id = _.get(req, 'params.repository_id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  // Fetch repository details by identifier
  const repositoryDetails = await getRepositoryById(repository_id, { is_active: true });

  // Validating if repository exists
  if (_.isEmpty(repositoryDetails)) {
    const code = 'REPOSITORY_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Repository not exists` });
    throw amlError(code, 'Repository not exists', 'NOT_FOUND', 404);
  }

  // Delete the repository
  await deleteRepositoryByIdentifier(repository_id);

  logger.info({ apiId, msgid, resmsgid, repository_id, message: 'Repository deleted successfully' });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Repository deleted successfully' } });
};

export default deleteRepositoryById;
