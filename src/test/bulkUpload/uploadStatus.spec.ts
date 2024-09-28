import app from '../../app';
import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import { describe, it, afterEach } from 'mocha';
import { S3Client } from '@aws-sdk/client-s3';
import { Process } from '../../models/process';

chai.use(chaiHttp);
chai.use(spies);
chai.should();

describe('BULK UPLOAD STATUS API', () => {
  const uploadStatusUrl = '/api/v1/bulk/upload/status';

  afterEach(() => {
    chai.spy.restore();
  });

  it('Should return a signed URL for errored process requested process id', (done) => {
    const processMockData = {
      id: 4,
      description: null,
      process_id: '0ef06eb0-c651-4fe5-baaa-617ab0e11c94',
      fileName: 'bulk_upload.zip',
      status: 'failed',
      error_status: 'empty',
      error_message: 'The uploaded zip folder is empty, please ensure a valid upload file.',
      content_error_file_name: 'c.csv',
      question_error_file_name: 'q.csv',
      question_set_error_file_name: 'qs.csv',
      is_active: true,
      created_by: 1,
      updated_by: null,
      created_at: '2024-09-23T16:50:12.652Z',
      updated_at: '2024-09-24T04:07:49.369Z',
    };

    chai.spy.on(Process, 'findOne', () => {
      return Promise.resolve(processMockData);
    });

    process.env.bucketName = 'value';
    chai.spy.on(S3Client.prototype, 'send', () => {
      return Promise.resolve({ url: 'signed url', message: 'success', error: false });
    });

    chai
      .request(app)
      .get(`${uploadStatusUrl}/0ef06eb0-c651-4fe5-baaa-617ab0e11c94`)
      .send()
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.responseCode.should.be.eq('OK');
        res.body.params.status.should.be.eq('SUCCESS');
        res.body.result.should.have.property('signedUrls').that.is.an('array');
        done();
      });
  });

  it('Should not return presigned url for process status open or completed or validated or reopen', (done) => {
    const processMockData = {
      id: 5,
      description: null,
      process_id: '4206d2e7-7efc-4f7c-a342-370aa165ccae',
      fileName: 'bulk_upload.zip',
      status: 'open',
      error_status: null,
      error_message: null,
      content_error_file_name: null,
      question_error_file_name: null,
      question_set_error_file_name: null,
      is_active: true,
      created_by: 1,
      updated_by: null,
      created_at: '2024-09-23T16:50:12.652Z',
      updated_at: '2024-09-24T04:07:49.369Z',
    };

    chai.spy.on(Process, 'findOne', () => {
      return Promise.resolve(processMockData);
    });

    chai
      .request(app)
      .get(`${uploadStatusUrl}/4206d2e7-7efc-4f7c-a342-370aa165ccae`)
      .send()
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.responseCode.should.be.eq('OK');
        res.body.params.status.should.be.eq('SUCCESS');
        done();
      });
  });

  it('Should return 404 for  Requested process id  does not exist', (done) => {
    chai.spy.on(Process, 'findOne', () => {
      return Promise.resolve(null);
    });

    chai
      .request(app)
      .get(`${uploadStatusUrl}/4206d2e7-7efc-4f7c-a342-370aa165ccae`)
      .send()
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.responseCode.should.be.eq('NOT_FOUND');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('PROCESS_NOT_EXISTS');
        done();
      });
  });

  it('Should return 500 and database connection error in read', (done) => {
    chai.spy.on(Process, 'findOne', () => {
      return Promise.reject(new Error('Database Connection Error'));
    });

    chai
      .request(app)
      .get(`${uploadStatusUrl}/4206d2e7-7efc-4f7c-a342-370aa165ccae`)
      .send()
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.responseCode.should.be.eq('INTERNAL_SERVER_ERROR');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('INTERNAL_SERVER_ERROR');
        done();
      });
  });
});
