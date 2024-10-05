import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiSpies from 'chai-spies';
import app from '../../app';
import { Repository } from '../../models/repository'; // Changed to Repository model

chai.use(chaiHttp);
chai.use(chaiSpies);

describe('Publish Repository API', () => {
  const publishUrl = '/api/v1/repository/publish'; // Updated endpoint for repository publishing

  afterEach(() => {
    chai.spy.restore(); // Restore spies after each test case
  });

  // Test for successful publishing
  it('should return 200 and publish the repository successfully', (done) => {
    chai.spy.on(Repository, 'findOne', () => {
      return Promise.resolve({ dataValues: { id: 1, is_active: true, status: 'draft' } });
    });
    chai.spy.on(Repository, 'update', () => {
      return Promise.resolve([1]); // Assuming successful update returns an array
    });

    chai
      .request(app)
      .post(`${publishUrl}/1`) // Sending request to publish repository with ID 1
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('SUCCESS');
        done();
      });
  });

  // Test for repository not found
  it('should return 404 if the repository does not exist', (done) => {
    chai.spy.on(Repository, 'findOne', () => {
      return Promise.resolve(null); // No repository found
    });

    chai
      .request(app)
      .post(`${publishUrl}/999`) // Attempting to publish non-existing repository
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.responseCode.should.be.eq('NOT_FOUND');
        done();
      });
  });

  // Test for database connection error in read
  it('should return 500 and database connection error in read', (done) => {
    chai.spy.on(Repository, 'findOne', () => {
      return Promise.reject(new Error('Database Connection Error')); // Simulating a database error
    });

    chai
      .request(app)
      .post(`${publishUrl}/1`) // Attempting to publish repository
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
