import app from '../../app';
import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import { describe, it } from 'mocha';
import { SkillTaxonomy } from '../../models/skillTaxonomy';

import { insert_skillTaxonomy_request } from './fixture';
import { SkillMaster } from '../../models/skill';

chai.use(spies);
chai.should();
chai.use(chaiHttp);

describe('skillTaxonomy CREATE API', () => {
  const insertUrl = '/api/v1/skillTaxonomy/create';

  // Restore spies after each test
  afterEach(() => {
    chai.spy.restore();
  });

  // Test case: Successful taxonomy creation
  it('Should insert taxonomy to database', (done) => {
    // Mocking SkillMaster.findAll to return mocked skill IDs
    chai.spy.on(SkillMaster, 'findAll', () => {
      return Promise.resolve([{ dataValues: { id: 1, name: { en: 'Substraction' }, type: 'l1_skill' } }, { dataValues: { id: 2, name: { en: '1D without carry' }, type: 'l2_skill' } }]);
    });

    // Mocking SkillTaxonomy.bulkCreate to simulate taxonomy creation
    chai.spy.on(SkillTaxonomy, 'bulkCreate', () => {
      return Promise.resolve([
        {
          dataValues: {
            identifier: '1',
          },
        },
      ]);
    });

    // Send the request
    chai
      .request(app)
      .post(insertUrl)
      .send(insert_skillTaxonomy_request.validRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('SUCCESS');
        done();
      });
  });

  // Test case: Database connection failure
  it('Should not insert record into the database when transaction fails', (done) => {
    // Mocking transaction to simulate a failure
    chai.spy.on(SkillTaxonomy, 'bulkCreate', () => {
      return Promise.reject(new Error('Database Connection Error'));
    });

    chai
      .request(app)
      .post(insertUrl)
      .send(insert_skillTaxonomy_request.validRequest)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('INTERNAL_SERVER_ERROR');
        done();
      });
  });

  // Test case: Request object contains missing fields
  it('Should not insert record when request object contains missing fields', (done) => {
    // Sending request with missing required fields
    chai
      .request(app)
      .post(insertUrl)
      .send(insert_skillTaxonomy_request.invalidRequest)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('SKILL_TAXONOMY_INVALID_INPUT');
        done();
      });
  });

  // Test case: Invalid schema in request
  it('Should not insert record when given invalid schema', (done) => {
    // Sending request with an invalid schema
    chai
      .request(app)
      .post(insertUrl)
      .send(insert_skillTaxonomy_request.invalidRequest)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('SKILL_TAXONOMY_INVALID_INPUT');
        done();
      });
  });
});
