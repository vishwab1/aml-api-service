import express from 'express';
import { setDataToRequestObject } from '../../middlewares/setDataToReqObj';
import learnerJourneyCreate from '../../controllers/LearnerJourneyCreate/learnerJourneyCreate';
import learnerJourneyRead from '../../controllers/LearnerJourneyRead/learnerJourneyRead';
import learnerJourneyUpdate from '../../controllers/LearnerJourneyUpdate/learnerJourneyUpdate';

export const learnerJourneyRouter = express.Router();

learnerJourneyRouter.post('/create', setDataToRequestObject('api.learner.journey.create'), learnerJourneyCreate);

learnerJourneyRouter.put('/update', setDataToRequestObject('api.learner.journey.update'), learnerJourneyUpdate);

learnerJourneyRouter.get('/read/:learner_id', setDataToRequestObject('api.learner.journey.read'), learnerJourneyRead);
