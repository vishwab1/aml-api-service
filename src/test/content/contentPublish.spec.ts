import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiSpies from 'chai-spies';
import app from '../../app';
import { Content } from '../../models/content'; // Changed to Content model

chai.use(chaiHttp);
chai.use(chaiSpies);

describe('Publish Content API', () => {
  const publishUrl = '/api/v1/content/publish'; // Updated endpoint

  afterEach(() => {
    chai.spy.restore(); // Restore spies after each test case
  });

  // Test for successful publishing
  it('should return 200 and publish the content successfully', (done) => {
    chai.spy.on(Content, 'findOne', () => {
      return Promise.resolve({ dataValues: { id: 1, is_active: true, status: 'draft' } });
    });
    chai.spy.on(Content, 'update', () => {
      return Promise.resolve({ status: 'live' });
    });

    chai
      .request(app)
      .post(`${publishUrl}/1`) // Sending request to publish content with ID 1
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('SUCCESS');
        done();
      });
  });

  // Test for content not found
  it('should return 404 if the content does not exist', (done) => {
    chai.spy.on(Content, 'findOne', () => {
      return Promise.resolve(null); // No content found
    });

    chai
      .request(app)
      .post(`${publishUrl}/999`) // Attempting to publish non-existing content
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
    chai.spy.on(Content, 'findOne', () => {
      return Promise.reject(new Error('Database Connection Error')); // Simulating a database error
    });

    chai
      .request(app)
      .post(`${publishUrl}/1`) // Attempting to publish content
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
