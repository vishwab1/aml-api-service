import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiSpies from 'chai-spies';
import app from '../../app';
import { Content } from '../../models/content'; // Changed to Content model
import { update_content_request } from './fixture'; // Kept the fixture for update requests

chai.use(chaiHttp);
chai.use(chaiSpies);

describe('Update Content API', () => {
  const updateUrl = '/api/v1/content/update'; // Updated endpoint

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and update the content successfully', (done) => {
    chai.spy.on(Content, 'findOne', () => {
      return Promise.resolve({ dataValues: { id: 1, is_active: true } });
    });
    chai.spy.on(Content, 'update', () => {
      return Promise.resolve({ name: 'Karnataka' });
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`) // Assuming ID 1 for the content
      .send(update_content_request.validRequest) // Use the valid update request from fixture
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('SUCCESS');
        done();
      });
  });

  it('should return 400 if the request body is invalid for content update', (done) => {
    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(update_content_request.invalidRequest) // Use the invalid request from fixture
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.responseCode.should.be.eq('BAD_REQUEST');
        done();
      });
  });

  it('should return 500 and database connection error in update', (done) => {
    chai.spy.on(Content, 'findOne', () => {
      return Promise.reject(new Error('Database Connection Error'));
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`) // Assuming ID 1 for the content
      .send(update_content_request.validRequest)
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
