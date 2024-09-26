import chai from 'chai';
import spies from 'chai-spies';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../../app';
import { LearnerJourney } from '../../../models/learnerJourney';

chai.use(spies);
chai.should();
chai.use(chaiHttp);

describe('Learner Journey Read API', () => {
  const requestURL = '/api/v1/learner/2ca3b11a-d581-4aa1-a199-fb1c51392cc9/journey/read';

  // Restore spies after each test
  afterEach(() => {
    chai.spy.restore();
  });

  it('should return the latest learner journey', (done) => {
    // Mocking LearnerJourney.findOne to simulate no LearnerJourney found
    chai.spy.on(LearnerJourney, 'findOne', () => {
      return Promise.resolve({
        id: 1,
        identifier: '2ca3b11a-d581-4aa1-a199-fb1c51392cc9',
        learner_id: '2ca3b11a-d581-4aa1-a199-fb1c51392cc9',
        question_set_id: '2ca3b11a-d581-4aa1-a199-fb1c51392cc9',
      });
    });

    // Sending request to the API
    chai
      .request(app)
      .get(requestURL)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('SUCCESS');
        done();
      });
  });

  it('should throw error if learner journey not found', (done) => {
    // Mocking Tenant.findOne to simulate no tenant found
    chai.spy.on(LearnerJourney, 'findOne', () => {
      return Promise.resolve(null);
    });

    // Sending request to the API
    chai
      .request(app)
      .get(requestURL)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('LEARNER_JOURNEY_NOT_FOUND');
        done();
      });
  });
});
