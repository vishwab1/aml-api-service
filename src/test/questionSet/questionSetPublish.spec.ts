import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiSpies from 'chai-spies';
import app from '../../app';
import { QuestionSet } from '../../models/quetionSet';

chai.use(chaiHttp);
chai.use(chaiSpies);

describe('Publish Question Set API', () => {
  const publishUrl = '/api/v1/question-set/publish'; // Updated endpoint

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and publish the question set successfully', (done) => {
    chai.spy.on(QuestionSet, 'findOne', () => {
      return Promise.resolve({ dataValues: { id: 1, is_active: true, status: 'draft' } });
    });
    chai.spy.on(QuestionSet, 'update', () => {
      return Promise.resolve({ status: 'live' });
    });

    chai
      .request(app)
      .post(`${publishUrl}/1`) // Sending request to publish question set with ID 1
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('SUCCESS');
        done();
      });
  });

  it('should return 404 if the question set does not exist', (done) => {
    chai.spy.on(QuestionSet, 'findOne', () => {
      return Promise.resolve(null); // No question set found
    });

    chai
      .request(app)
      .post(`${publishUrl}/999`) // Attempting to publish non-existing question set
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.responseCode.should.be.eq('NOT_FOUND');
        done();
      });
  });

  it('should return 500 and database connection error in read', (done) => {
    chai.spy.on(QuestionSet, 'findOne', () => {
      return Promise.reject(new Error('Database Connection Error')); // Simulating a database error
    });

    chai
      .request(app)
      .post(`${publishUrl}/1`) // Attempting to publish question set
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.responseCode.should.be.eq('INTERNAL_SERVER_ERROR');
        done();
      });
  });
});
