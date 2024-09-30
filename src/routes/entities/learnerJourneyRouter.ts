import express from 'express';
import { setDataToRequestObject } from '../../middlewares/setDataToReqObj';
import { learnerJourneyCreate } from '../../controllers/LearnerJourneyCreate/LearnerJourneyCreate';
import { learnerJourneyRead } from '../../controllers/LearnerJourneyRead/LearnerJourneyRead';
import { learnerJourneyUpdate } from '../../controllers/LearnerJourneyUpdate/LearnerJourneyUpdate';

export const learnerJourneyRouter = express.Router();

learnerJourneyRouter.post('/create', setDataToRequestObject('api.learner.journey.create'), learnerJourneyCreate);

learnerJourneyRouter.put('/update', setDataToRequestObject('api.learner.journey.update'), learnerJourneyUpdate);

learnerJourneyRouter.get('/read/:learner_id', setDataToRequestObject('api.learner.journey.read'), learnerJourneyRead);
