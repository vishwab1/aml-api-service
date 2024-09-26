export interface UpdateLearnerJourney {
  completed_question_ids?: string[];
  start_time?: string;
  end_time?: string;
  status?: string;
  attempts_count?: number;
  created_by?: string;
  updated_by?: string;
}
