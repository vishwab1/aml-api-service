import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { schemaValidation } from '../../services/validationService';
import learnerCreateJSON from './createLearnerJourneyValidationSchema.json';
import logger from '../../utils/logger';
import { ResponseHandler } from '../../utils/responseHandler';
import { amlError } from '../../types/AmlError';
import { createLearnerJourney } from '../../services/learnerJourney';
import * as uuid from 'uuid';

export const apiId = 'api.learner.journey.create';

export const learnerJourneyCreate = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const dataBody = _.get(req, 'body.request');
  const resmsgid = _.get(res, 'resmsgid');
  const learner_id = _.get(req, 'params.learner_id');

  // TODO: validate learner_id

  const isRequestValid: Record<string, any> = schemaValidation(requestBody, learnerCreateJSON);

  if (!isRequestValid.isValid) {
    const code = 'LEARNER_JOURNEY_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  // TODO: validate question_set_id

  const learnerJourneyInsertData = {
    ...dataBody,
    learner_id,
    identifier: uuid.v4(),
    created_by: uuid.v4(), // TODO: Replace with valid user identifier
  };

  const learnerJourney = await createLearnerJourney(learnerJourneyInsertData);

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Learner journey started successfully', identifier: learnerJourney.dataValues.identifier } });
};
