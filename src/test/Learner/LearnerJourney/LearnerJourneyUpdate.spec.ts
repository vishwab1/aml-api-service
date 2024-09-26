import chai from 'chai';
import spies from 'chai-spies';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../../app';
import { LearnerJourney } from '../../../models/learnerJourney';
import { learner_journey_request } from './fixture';

chai.use(spies);
chai.should();
chai.use(chaiHttp);

describe('Learner Journey Update API', () => {
  const requestURL = '/api/v1/learner/2ca3b11a-d581-4aa1-a199-fb1c51392cc9/journey/update';

  // Restore spies after each test
  afterEach(() => {
    chai.spy.restore();
  });

  it('should update learner journey for valid data', (done) => {
    // Mocking LearnerJourney.findOne to simulate no LearnerJourney found
    chai.spy.on(LearnerJourney, 'findOne', () => {
      return Promise.resolve({
        id: 1,
        identifier: '2ca3b11a-d581-4aa1-a199-fb1c51392cc9',
        learner_id: '2ca3b11a-d581-4aa1-a199-fb1c51392cc9',
        question_set_id: '2ca3b11a-d581-4aa1-a199-fb1c51392cc9',
      });
    });

    // Mocking LearnerJourney.create to simulate LearnerJourney creation
    chai.spy.on(LearnerJourney, 'update', () => {
      return Promise.resolve({
        dataValues: {
          id: 1,
          identifier: '2ca3b11a-d581-4aa1-a199-fb1c51392cc9',
          learner_id: '2ca3b11a-d581-4aa1-a199-fb1c51392cc9',
          question_set_id: '2ca3b11a-d581-4aa1-a199-fb1c51392cc9',
          start_time: '2024-09-03T12:34:56Z',
          end_time: '2024-09-03T12:34:56Z',
          completed_question_ids: ['123e4567-e89b-12d3-a456-426614174000'],
        },
      });
    });

    // Sending request to the API
    chai
      .request(app)
      .put(requestURL)
      .send(learner_journey_request.learnerJourneyUpdate)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('SUCCESS');
        done();
      });
  });

  it('should throw error for invalid data', (done) => {
    // Mocking Tenant.findOne to simulate no tenant found
    chai.spy.on(LearnerJourney, 'findOne', () => {
      return Promise.resolve(null);
    });

    // Sending request to the API
    chai
      .request(app)
      .put(requestURL)
      .send(learner_journey_request.learnerJourneyUpdateInvalidData)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('LEARNER_JOURNEY_INVALID_INPUT');
        done();
      });
  });
});
