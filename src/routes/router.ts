import express from 'express';
import { setDataToRequestObject } from '../middlewares/setDataToReqObj';
import TenantCreate from '../controllers/TenantCreate/TenantCreate';
import tenantUpdate from '../controllers/TenantUpdate/updateTenant';
import ReadSingleTenant from '../controllers/TenantRead/GetSingleTenant';
import tenantSearch from '../controllers/TenantSearch/TenantSearch';
import getUrlQuestionUpload from '../controllers/Bulk_upload/questionUpload';
import uploadStatus from '../controllers/Bulk_upload/uploadStatus';
import getTemplate from '../controllers/template/getTemplate';

export const router = express.Router();

router.post('/tenant/create', setDataToRequestObject('api.tenant.create'), TenantCreate);

router.post('/tenant/update/:tenant_id', setDataToRequestObject('api.tenant.update'), tenantUpdate);

router.get('/tenant/read/:tenant_id', setDataToRequestObject('api.tenant.read'), ReadSingleTenant);

router.post('/tenant/search', setDataToRequestObject('api.tenant.search'), tenantSearch);

router.get('/read/template/:fileName', setDataToRequestObject('api.get.template'), getTemplate);

router.post('/bulk/upload/zip', setDataToRequestObject('api.upload.zip'), getUrlQuestionUpload);

router.get('/upload/status/:process_id', setDataToRequestObject('api.upload.status'), uploadStatus);
