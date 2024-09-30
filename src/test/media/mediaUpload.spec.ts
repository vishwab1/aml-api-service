import app from '../../app';
import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import { describe, it, afterEach } from 'mocha';
import { S3Client } from '@aws-sdk/client-s3';
import { mediaUploadFixture } from './fixture';

chai.use(chaiHttp);
chai.use(spies);
chai.should();

describe('MEDIA UPLOAD API', () => {
  const uploadStatusUrl = '/api/v1/media/upload/presignedUrl';

  afterEach(() => {
    chai.spy.restore();
  });

  it('Should return 200 and a signed URL upload for valid request', (done) => {
    chai.spy.on(S3Client.prototype, 'send', () => {
      return Promise.resolve({ url: 'signed url', message: 'success', error: false });
    });

    chai
      .request(app)
      .post(uploadStatusUrl)
      .send(mediaUploadFixture.validRequest)
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

  it('Should return 400 with bad request for missing request body fields', (done) => {
    chai
      .request(app)
      .post(uploadStatusUrl)
      .send(mediaUploadFixture.missingFields)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.responseCode.should.be.eq('BAD_REQUEST');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('MEDIA_UPLOAD_INVALID_INPUT');
        done();
      });
  });

  it('Should return 400 with bad request for invalid schema', (done) => {
    chai
      .request(app)
      .post(uploadStatusUrl)
      .send(mediaUploadFixture.invalidSchema)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.responseCode.should.be.eq('BAD_REQUEST');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('MEDIA_UPLOAD_INVALID_INPUT');
        done();
      });
  });

  it('Should return 400 with bad request for invalid category', (done) => {
    chai
      .request(app)
      .post(uploadStatusUrl)
      .send(mediaUploadFixture.invalidCategory)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.responseCode.should.be.eq('BAD_REQUEST');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('MEDIA_UPLOAD_INVALID_INPUT');
        done();
      });
  });

  it('Should return 400 with bad request for empty request body', (done) => {
    chai
      .request(app)
      .post(uploadStatusUrl)
      .send(mediaUploadFixture.emptyRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.responseCode.should.be.eq('BAD_REQUEST');
        res.body.params.status.should.be.eq('FAILED');
        res.body.error.code.should.be.eq('MEDIA_UPLOAD_INVALID_INPUT');
        done();
      });
  });
});
