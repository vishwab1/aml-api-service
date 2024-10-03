import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiSpies from 'chai-spies';
import app from '../../app';
import { Content } from '../../models/content'; // Changed model import to Content

chai.use(chaiHttp);
chai.use(chaiSpies);

describe('Read Content API', () => {
  const getUrl = '/api/v1/content/read'; // Updated endpoint

  afterEach(() => {
    chai.spy.restore(); // Restore spies after each test case
  });

  // Test for successful retrieval of content details
  it('should return 200 and successfully retrieve the content details', (done) => {
    // Mocking the findOne method to return a valid content
    const mockContentData = {
      identifier: 'a598133a-df9e-4e26-8281-86d148899c04',
      cid: 'content0004',
      name: {
        en: 'This is a content for Division',
        hi: 'यह विभाजन के लिए सामग्री है',
        ka: 'ಇದು ವಿಭಜನೆಯ ವಿಷಯವಾಗುತ್ತದೆ',
      },
      description: {
        en: 'This is the description for the content',
      },
      tenant: {
        name: 'EkStep',
      },
      repository: {
        name: 'AML',
      },
      created_at: '2024-09-12T20:17:05.601Z',
      updated_at: '2024-09-12T20:17:05.602Z',
      is_active: true,
      // Add other relevant fields for the Content model here
    };

    // Mocking findOne to return mockContentData
    chai.spy.on(Content, 'findOne', () => {
      return Promise.resolve({ dataValues: mockContentData }); // Return mock data
    });

    // Performing GET request to fetch the content
    chai
      .request(app)
      .get(`${getUrl}/1`) // Assuming 1 is the content ID
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
      .get(`${getUrl}/999`) // Attempting to read a non-existing content
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
    chai.spy.on(Content, 'findOne', () => {
      return Promise.reject(new Error('Database Connection Error')); // Simulate a database error
    });

    chai
      .request(app)
      .get(`${getUrl}/1`) // Attempting to read content
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
