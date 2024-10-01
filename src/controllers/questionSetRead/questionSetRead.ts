import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { getQuestionSetById } from '../../services/questionSet';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';

export const apiId = 'api.questionSet.read';

const readQuestionSetById = async (req: Request, res: Response) => {
  const questionSet_id = _.get(req, 'params.question_set__id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  const questionSetDetails = await getQuestionSetById(questionSet_id);

  // Validating if question set exists
  if (_.isEmpty(questionSetDetails)) {
    const code = 'QUESTION_SET_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Question Set not exists` });
    throw amlError(code, 'Question Set not exists', 'NOT_FOUND', 404);
  }

  logger.info({ apiId, questionSet_id, message: `Question Set read successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: questionSetDetails });
};

export default readQuestionSetById;
