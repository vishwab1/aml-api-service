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

describe('learner Journey Create API', () => {
  const requestURL = '/api/v1/learner/journey/create';

  // Restore spies after each test
  afterEach(() => {
    chai.spy.restore();
  });

  it('should create learner journey for valid data', (done) => {
    // Mocking learnerJourney.findOne to simulate no learnerJourney found
    chai.spy.on(LearnerJourney, 'findOne', () => {
      return Promise.resolve(null);
    });

    // Mocking learnerJourney.create to simulate learnerJourney creation
    chai.spy.on(LearnerJourney, 'create', () => {
      return Promise.resolve({
        dataValues: { id: 1, identifier: '2ca3b11a-d581-4aa1-a199-fb1c51392cc9', learner_id: '2ca3b11a-d581-4aa1-a199-fb1c51392cc9', question_set_id: '2ca3b11a-d581-4aa1-a199-fb1c51392cc9' },
      });
    });

    // Sending request to the API
    chai
      .request(app)
      .post(requestURL)
      .send(learner_journey_request.learnerJourneyCreate)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('SUCCESS');
        done();
      });
  });

  it('Should not insert record into the database when transaction fails', (done) => {
    // Mocking learnerJourney.create to simulate learnerJourney creation
    chai.spy.on(LearnerJourney, 'create', () => {
      return Promise.reject(new Error('Database Connection Error'));
    });

    // Sending request to the API
    chai
      .request(app)
      .post(requestURL)
      .send(learner_journey_request.learnerJourneyCreate)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('INTERNAL_SERVER_ERROR');
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
      .post(requestURL)
      .send(learner_journey_request.learnerJourneyCreateInvalidData)
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
