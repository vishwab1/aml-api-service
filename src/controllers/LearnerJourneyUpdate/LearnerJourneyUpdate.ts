import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { schemaValidation } from '../../services/validationService';
import learnerUpdateJSON from './updateLearnerJourneyValidationSchema.json';
import logger from '../../utils/logger';
import { ResponseHandler } from '../../utils/responseHandler';
import { amlError } from '../../types/AmlError';
import { readLearnerJourney, updateLearnerJourney } from '../../services/learnerJourney';

export const apiId = 'api.learner.journey.update';

export const learnerJourneyUpdate = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const dataBody = _.get(req, 'body.request');
  const learner_id = _.get(req, 'params.learner_id');
  const resmsgid = _.get(res, 'resmsgid');

  const isRequestValid: Record<string, any> = schemaValidation(requestBody, learnerUpdateJSON);

  if (!isRequestValid.isValid) {
    const code = 'LEARNER_JOURNEY_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }
  // TODO: validate question_set_id, completed_question_ids & learner_id
  // TODO: conclude journey status on the basis of completed question ids

  const { learnerJourney } = await readLearnerJourney(learner_id);

  await updateLearnerJourney(learnerJourney.identifier, dataBody);

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Learner journey updated successfully' } });
};
