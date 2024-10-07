import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiSpies from 'chai-spies';
import app from '../../app';
import { Repository } from '../../models/repository'; // Changed to Repository model
import { update_repository_request } from './fixture'; // Ensure this fixture is for update requests

chai.use(chaiHttp);
chai.use(chaiSpies);

describe('Update Repository API', () => {
  const updateUrl = '/api/v1/repository/update'; // Updated endpoint

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and update the repository successfully', (done) => {
    chai.spy.on(Repository, 'findOne', () => {
      return Promise.resolve({ dataValues: { id: 1, is_active: true } });
    });
    chai.spy.on(Repository, 'update', () => {
      return Promise.resolve({ name: 'Karnataka Repository' }); // Mock updated repository data
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`) // Assuming ID 1 for the repository
      .send(update_repository_request.validRequest) // Use the valid update request from fixture
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('SUCCESS');
        done();
      });
  });

  it('should return 400 if the request body is invalid for repository update', (done) => {
    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(update_repository_request.invalidRequest) // Use the invalid request from fixture
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
    chai.spy.on(Repository, 'findOne', () => {
      return Promise.reject(new Error('Database Connection Error'));
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`) // Assuming ID 1 for the repository
      .send(update_repository_request.validRequest)
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
