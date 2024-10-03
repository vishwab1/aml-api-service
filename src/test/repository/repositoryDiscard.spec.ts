import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiSpies from 'chai-spies';
import app from '../../app';
import { Repository } from '../../models/repository'; // Changed to Repository model

chai.use(chaiHttp);
chai.use(chaiSpies);

describe('Discard Repository API', () => {
  const discardUrl = '/api/v1/repository/discard'; // Updated endpoint for repository discard

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and discard the repository successfully', (done) => {
    // Mocking findOne to return a repository
    chai.spy.on(Repository, 'findOne', () => {
      return Promise.resolve({ dataValues: { id: 3 } });
    });
    // Mocking destroy to simulate successful deletion
    chai.spy.on(Repository, 'destroy', () => {
      return Promise.resolve(1); // Number of rows affected
    });

    chai
      .request(app)
      .post(`${discardUrl}/3`) // Sending request to discard repository with ID 3
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('SUCCESS');
        done();
      });
  });

  it('should return 404 if the repository does not exist', (done) => {
    // Mocking findOne to return null
    chai.spy.on(Repository, 'findOne', () => {
      return Promise.resolve(null);
    });

    chai
      .request(app)
      .post(`${discardUrl}/1`) // Attempting to discard non-existing repository
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
    chai.spy.on(Repository, 'findOne', () => {
      return Promise.reject(new Error('Database Connection Error'));
    });

    chai
      .request(app)
      .post(`${discardUrl}/1`) // Attempting to discard repository
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
