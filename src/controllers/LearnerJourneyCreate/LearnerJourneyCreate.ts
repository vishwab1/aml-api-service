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
import moment from 'moment';

export const apiId = 'api.learner.journey.create';

export const learnerJourneyCreate = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const dataBody = _.get(req, 'body.request');
  const resmsgid = _.get(res, 'resmsgid');

  const isRequestValid: Record<string, any> = schemaValidation(requestBody, learnerCreateJSON);

  const invalidStartTime = dataBody.start_time && !moment(dataBody.start_time).isValid();

  if (!isRequestValid.isValid || invalidStartTime) {
    const code = 'LEARNER_JOURNEY_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: invalidStartTime ? 'Invalid start_time format' : isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  // TODO: validate learner_id & question_set_id

  const learnerJourneyInsertData = {
    ...dataBody,
    identifier: uuid.v4(),
    created_by: uuid.v4(), // TODO: Replace with valid user identifier
  };

  const learnerJourney = await createLearnerJourney(learnerJourneyInsertData);

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Learner journey started successfully', identifier: learnerJourney.dataValues.identifier } });
};
