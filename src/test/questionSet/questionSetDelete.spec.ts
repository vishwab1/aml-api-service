import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiSpies from 'chai-spies';
import app from '../../app';
import { QuestionSet } from '../../models/questionSet';

chai.use(chaiHttp);
chai.use(chaiSpies);

describe('Delete Question Set API', () => {
  const deleteUrl = '/api/v1/question-set/delete';

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and delete the question set successfully', (done) => {
    // Mocking findOne to return a question set
    chai.spy.on(QuestionSet, 'findOne', () => {
      return Promise.resolve({ dataValues: { id: 1, is_active: true } });
    });
    // Mocking update to simulate the deletion
    chai.spy.on(QuestionSet, 'update', () => {
      return Promise.resolve([1]); // Assuming successful update returns an array
    });

    chai
      .request(app)
      .post(`${deleteUrl}/1`) // Sending request to delete question set with ID 1
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('SUCCESS');
        done();
      });
  });

  it('should return 404 if the question set does not exist', (done) => {
    // Mocking findOne to return null
    chai.spy.on(QuestionSet, 'findOne', () => {
      return Promise.resolve(null);
    });

    chai
      .request(app)
      .post(`${deleteUrl}/1`) // Attempting to delete non-existing question set
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.responseCode.should.be.eq('NOT_FOUND');
        done();
      });
  });

  it('should return 500 and database connection error', (done) => {
    // Mocking findOne to throw a database error
    chai.spy.on(QuestionSet, 'findOne', () => {
      return Promise.reject(new Error('Database Connection Error'));
    });

    chai
      .request(app)
      .post(`${deleteUrl}/1`) // Attempting to delete question set
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
