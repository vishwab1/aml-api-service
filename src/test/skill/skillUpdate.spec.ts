import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiSpies from 'chai-spies';
import app from '../../app';
import { SkillMaster } from '../../models/skill'; // Adjust this import as needed
import { skill_update_request } from './fixture'; // Ensure this file provides the correct fixtures

chai.use(chaiHttp);
chai.use(chaiSpies);

describe('SKILL UPDATE API', () => {
  const updateUrl = '/api/v1/skill/update'; // Updated URL for skill

  afterEach(() => {
    chai.spy.restore();
  });

  // Test case: Successful skill update
  it('should return 200 and update the skill successfully', (done) => {
    chai.spy.on(SkillMaster, 'findOne', () => {
      return Promise.resolve({ dataValues: { name: 'Substraction1', type: 'l1_skill' } });
    });
    chai.spy.on(SkillMaster, 'update', () => {
      return Promise.resolve([1, [{ id: 1, name: 'Substraction1', type: 'l1_skill' }]]); // Simulate successful update
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(skill_update_request.validRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('SUCCESS');
        done();
      });
  });

  // Test case: Invalid request body
  it('should return 400 if the request body is invalid for skill update', (done) => {
    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(skill_update_request.invalidRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('SKILL_INVALID_INPUT'); // Updated error code
        done();
      });
  });

  // Test case: Not Found error
  it('should return 404 if the skill does not exist', (done) => {
    chai.spy.on(SkillMaster, 'findOne', () => {
      return Promise.resolve(null); // Simulate not found
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(skill_update_request.validRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('SKILL_NOT_EXISTS'); // Updated error code
        done();
      });
  });

  // Test case: Database connection error
  it('should return 500 and database connection error in read', (done) => {
    chai.spy.on(SkillMaster, 'findOne', () => {
      return Promise.reject(new Error('Database Connection Error'));
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(skill_update_request.validRequest)
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
