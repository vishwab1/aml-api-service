export const learner_journey_request = {
  // CREATE
  learnerJourneyCreate: {
    id: 'api.learner.journey.create',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      question_set_id: '37a60112-1136-40cc-b968-2f664feb1864',
      start_time: '2024-09-03T12:34:56Z',
    },
  },
  learnerJourneyCreateInvalidData: {
    id: 'api.learner.journey.create',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      question_set_id: 10, // invalid question_set_id
      start_time: '2024-09-03T12:34:56Z',
    },
  },

  // UPDATE
  learnerJourneyUpdate: {
    id: 'api.learner.journey.update',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      start_time: '2024-09-03T12:34:56Z',
      end_time: '2024-09-03T12:34:56Z',
      completed_question_ids: ['123e4567-e89b-12d3-a456-426614174000'],
    },
  },
  learnerJourneyUpdateInvalidData: {
    id: 'api.learner.journey.update',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      start_time: '2024-09-03T12:34:56Z',
      completed_question_ids: [1, 2, 3], // invalid completed_question_ids
    },
  },
};
