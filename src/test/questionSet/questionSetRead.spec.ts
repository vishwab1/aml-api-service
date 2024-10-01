import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiSpies from 'chai-spies';
import app from '../../app';
import { QuestionSet } from '../../models/quetionSet'; // Corrected model import

chai.use(chaiHttp);
chai.use(chaiSpies);

describe('Read Question Set API', () => {
  const getUrl = '/api/v1/question-set/read'; // Updated endpoint

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and successfully retrieve the question set details', (done) => {
    // Mocking the findOne method to return a valid question set
    const mockQuestionSetData = {
      identifier: 'a598133a-df9e-4e26-8281-86d148899c04',
      qid: 'set0004',
      name: {
        en: 'This is a question set for Division',
        hi: 'यह विभाजन के लिए प्रश्न सेट है',
        ka: 'ಇದು ವಿಭಜನೆಯ ಪ್ರಶ್ನೆ ಸೆಟ್ನಾಗುತ್ತದೆ',
      },
      description: {
        en: 'This is the description for the question set',
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
      // Add other relevant fields for the QuestionSet model here
    };

    // Mocking findOne to return mockQuestionSetData
    chai.spy.on(QuestionSet, 'findOne', () => {
      return Promise.resolve({ dataValues: mockQuestionSetData }); // Return mock data
    });

    // Performing GET request to fetch the question set
    chai
      .request(app)
      .get(`${getUrl}/1`) // Assuming 1 is the question set ID
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
      .get(`${getUrl}/999`) // Attempting to read a non-existing question set
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
      return Promise.reject(new Error('Database Connection Error')); // Simulate a database error
    });

    chai
      .request(app)
      .get(`${getUrl}/1`) // Attempting to read question set
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
