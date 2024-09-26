import express from 'express';
import { learnerJourneyRouter } from './learnerJourneyRouter';

export const learnerRouter = express.Router({ mergeParams: true });

learnerRouter.use('/:learner_id/journey', learnerJourneyRouter);
