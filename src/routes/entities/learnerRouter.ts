import express from 'express';
import { learnerJourneyRouter } from './learnerJourneyRouter';

export const learnerRouter = express.Router();

learnerRouter.use('/journey', learnerJourneyRouter);
