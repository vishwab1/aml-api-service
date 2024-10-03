import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import app from '../../app';
import { schemaValidation } from '../../services/validationService';
import { Repository } from '../../models/repository'; // Changed model import to Repository
import { search_repository_request } from './fixture'; // Ensure this contains valid and invalid request fixtures

chai.use(chaiHttp);
chai.use(spies);

describe('Repository Search API', () => {
  const searchUrl = '/api/v1/repository/search'; // Updated endpoint for repository search

  afterEach(() => {
    chai.spy.restore(); // Restore spies after each test
  });

  it('should return 200 and the list of repository items for a valid request', (done) => {
    const mockRepositoryData = [
      {
        dataValues: {
          name: { en: 'Kerala Repository', ta: 'கேரளா தொகுப்பு' },
          type: { en: 'education', ta: 'கல்வி' },
          is_active: true,
          status: 'live',
          created_by: 'system',
          created_at: '2024-09-04T11:02:26.821Z',
        },
      },
    ];

    // Mock the schema validation to return valid
    chai.spy.on(schemaValidation, 'default', () => {
      return { isValid: true };
    });

    // Mock the Repository model's findAll method
    chai.spy.on(Repository, 'findAll', () => {
      return Promise.resolve(mockRepositoryData);
    });

    chai
      .request(app)
      .post(searchUrl)
      .send(search_repository_request.validRequest) // Ensure validRequest is properly defined in your fixture
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.equal('SUCCESS');
        res.body.responseCode.should.equal('OK');
        done();
      });
  });

  it('should return 400 if the request body is invalid for Repository search', (done) => {
    chai
      .request(app)
      .post(searchUrl)
      .send(search_repository_request.invalidRequest) // Ensure invalidRequest is properly defined in your fixture
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.equal('FAILED'); // Use strict equality
        res.body.responseCode.should.equal('BAD_REQUEST'); // Use strict equality
        done();
      });
  });
});
