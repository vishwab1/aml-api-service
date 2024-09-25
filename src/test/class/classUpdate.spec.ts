import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiSpies from 'chai-spies';
import app from '../../app';
import { classMaster } from '../../models/classMaster'; // Adjust this import as needed
import { class_update_request } from './fixture'; // Ensure this file provides the correct fixtures

chai.use(chaiHttp);
chai.use(chaiSpies);

describe('CLASS UPDATE API', () => {
  const updateUrl = '/api/v1/class/update'; // Updated URL for class

  afterEach(() => {
    chai.spy.restore();
  });

  // Test case: Successful class update
  it('should return 200 and update the class successfully', (done) => {
    chai.spy.on(classMaster, 'findOne', () => {
      return Promise.resolve({ dataValues: { name: 'Class One1', status: 'live' } });
    });
    chai.spy.on(classMaster, 'update', () => {
      return Promise.resolve([1, [{ id: 1, name: 'Class One1', status: 'live' }]]); // Simulate successful update
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(class_update_request.validRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('SUCCESS');
        done();
      });
  });

  // Test case: Invalid request body
  it('should return 400 if the request body is invalid for class update', (done) => {
    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(class_update_request.invalidRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('CLASS_INVALID_INPUT'); // Updated error code
        done();
      });
  });

  // Test case: Not Found error
  it('should return 404 if the class does not exist', (done) => {
    chai.spy.on(classMaster, 'findOne', () => {
      return Promise.resolve(null); // Simulate not found
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(class_update_request.validRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('CLASS_NOT_EXISTS'); // Updated error code
        done();
      });
  });

  // Test case: Database connection error
  it('should return 500 and database connection error in read', (done) => {
    chai.spy.on(classMaster, 'findOne', () => {
      return Promise.reject(new Error('Database Connection Error'));
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(class_update_request.validRequest)
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
