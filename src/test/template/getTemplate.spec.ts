import app from '../../app';
import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import { describe, it, afterEach } from 'mocha';
import { S3Client } from '@aws-sdk/client-s3';

chai.use(chaiHttp);
chai.use(spies);
chai.should();

describe('GET TEMPLATE BULK UPLOAD API', () => {
  const templateUrl = '/api/v1/bulk/template/read';

  afterEach(() => {
    chai.spy.restore();
  });

  it('Should return 200 and a signed URL for given file name to download a template file', (done) => {
    process.env.bucketName = 'value';
    chai.spy.on(S3Client.prototype, 'send', () => {
      return Promise.resolve({ url: 'signed url', message: 'success', error: false });
    });

    chai
      .request(app)
      .get(`${templateUrl}/bulk_upload.zip`)
      .send()
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.responseCode.should.be.eq('OK');
        res.body.params.status.should.be.eq('SUCCESS');
        res.body.result.should.have.property('url').that.is.an('string');
        done();
      });
  });
});
