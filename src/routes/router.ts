import express from 'express';
import { setDataToRequestObject } from '../middlewares/setDataToReqObj';
import TenantCreate from '../controllers/TenantCreate/TenantCreate';
import tenantUpdate from '../controllers/TenantUpdate/updateTenant';
import ReadSingleTenant from '../controllers/TenantRead/GetSingleTenant';
import tenantSearch from '../controllers/TenantSearch/TenantSearch';
import { masterCreate } from '../controllers/MasterCreate/MasterCreate';
import { masterSearch } from '../controllers/MasterSearch/MasterSearch';
import getBulkUploadURL from '../controllers/bulkUpload/bulkUpload';
import uploadStatus from '../controllers/bulkUpload/uploadStatus';
import getTemplate from '../controllers/template/getTemplate';
import getMediaUploadURL from '../controllers/mediaUpload/mediaUpload';
import getMediaReadURL from '../controllers/mediaUpload/mediaRead';

export const router = express.Router();

router.post('/tenant/create', setDataToRequestObject('api.tenant.create'), TenantCreate);

router.post('/tenant/update/:tenant_id', setDataToRequestObject('api.tenant.update'), tenantUpdate);

router.get('/tenant/read/:tenant_id', setDataToRequestObject('api.tenant.read'), ReadSingleTenant);

router.post('/tenant/search', setDataToRequestObject('api.tenant.search'), tenantSearch);

router.post('/master/create', setDataToRequestObject('api.master.create'), masterCreate);

router.post('/master/search', setDataToRequestObject('api.master.search'), masterSearch);

router.post('/bulk/upload/url', setDataToRequestObject('api.bulk.url'), getBulkUploadURL);

router.get('/bulk/template/read/:fileName', setDataToRequestObject('api.bulk.template'), getTemplate);

router.get('/bulk/upload/status/:process_id', setDataToRequestObject('api.bulk.status'), uploadStatus);

router.post('/media/upload/presignedUrl', setDataToRequestObject('api.media.upload'), getMediaUploadURL);

router.post('/media/read/presignedUrl', setDataToRequestObject('api.media.read'), getMediaReadURL);
