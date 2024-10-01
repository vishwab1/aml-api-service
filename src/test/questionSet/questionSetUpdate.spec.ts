import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiSpies from 'chai-spies';
import app from '../../app';
import { QuestionSet } from '../../models/quetionSet';
import { update_question_set_request } from './fixture';

chai.use(chaiHttp);
chai.use(chaiSpies);

describe('Update Question Set API', () => {
  const updateUrl = '/api/v1/question-set/update';

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and update the question set successfully', (done) => {
    chai.spy.on(QuestionSet, 'findOne', () => {
      return Promise.resolve({ dataValues: { id: 1, is_active: true } });
    });
    chai.spy.on(QuestionSet, 'update', () => {
      return Promise.resolve({ name: 'Karnataka' });
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(update_question_set_request.validRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('SUCCESS');
        done();
      });
  });

  it('should return 400 if the request body is invalid for question set update', (done) => {
    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(update_question_set_request.invalidRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.responseCode.should.be.eq('BAD_REQUEST');
        done();
      });
  });

  it('should return 500 and database connection error in read', (done) => {
    chai.spy.on(QuestionSet, 'findOne', () => {
      return Promise.reject(new Error('Database Connection Error'));
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(update_question_set_request.validRequest)
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
