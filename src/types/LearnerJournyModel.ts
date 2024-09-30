import { LearnerJourneyStatus } from '../enums/learnerJourneyStatus';

export interface UpdateLearnerJourney {
  completed_question_ids?: string[];
  start_time?: string;
  end_time?: string | null;
  status?: LearnerJourneyStatus;
  attempts_count?: number;
  created_by?: string;
  updated_by?: string;
}
