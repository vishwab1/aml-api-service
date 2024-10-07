import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiSpies from 'chai-spies';
import app from '../../app';
import { Repository } from '../../models/repository'; // Changed model import to Repository

chai.use(chaiHttp);
chai.use(chaiSpies);

describe('Read Repository API', () => {
  const getUrl = '/api/v1/repository/read'; // Updated endpoint for repository reading

  afterEach(() => {
    chai.spy.restore(); // Restore spies after each test case
  });

  // Test for successful retrieval of repository details
  it('should return 200 and successfully retrieve the repository details', (done) => {
    // Mocking the findOne method to return valid repository data
    const mockRepositoryData = {
      identifier: 'a598133a-df9e-4e26-8281-86d148899c04',
      cid: 'repository0004',
      name: {
        en: 'This is a repository for Division',
        hi: 'यह विभाजन के लिए रिपॉजिटरी है',
        ka: 'ಇದು ವಿಭಾಗದ ರಿಪೋಸಿಟರಿ',
      },
      description: {
        en: 'This is the description for the repository',
      },
      tenant: {
        name: 'EkStep',
      },
      created_at: '2024-09-12T20:17:05.601Z',
      updated_at: '2024-09-12T20:17:05.602Z',
      is_active: true,
      // Add other relevant fields for the Repository model here
    };

    // Mocking findOne to return mockRepositoryData
    chai.spy.on(Repository, 'findOne', () => {
      return Promise.resolve({ dataValues: mockRepositoryData }); // Return mock data
    });

    // Performing GET request to fetch the repository
    chai
      .request(app)
      .get(`${getUrl}/1`) // Assuming 1 is the repository ID
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
      .get(`${getUrl}/999`) // Attempting to read a non-existing repository
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.responseCode.should.be.eq('NOT_FOUND');
        done();
      });
  });

  // Test for database connection error during read
  it('should return 500 and database connection error in read', (done) => {
    chai.spy.on(Repository, 'findOne', () => {
      return Promise.reject(new Error('Database Connection Error')); // Simulate a database error
    });

    chai
      .request(app)
      .get(`${getUrl}/1`) // Attempting to read repository
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
