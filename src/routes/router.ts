import express from 'express';
import { setDataToRequestObject } from '../middlewares/setDataToReqObj';
import getBulkUploadURL from '../controllers/bulkUpload/bulkUpload';
import uploadStatus from '../controllers/bulkUpload/uploadStatus';
import getTemplate from '../controllers/template/getTemplate';
import tenantCreate from '../controllers/tenantCreate/tenantCreate';
import tenantUpdate from '../controllers/tenantUpdate/tenantUpdate';
import readTeantById from '../controllers/tenantRead/tenantRead';
import tenantSearch from '../controllers/tenantSearch/tenantSearch';
import { masterCreate } from '../controllers/masterCreate/masterCreate';
import { masterSearch } from '../controllers/masterSearch/masterSearch';
import boardUpdate from '../controllers/boardUpdate/boardUpdate';
import classUpdate from '../controllers/classUpdate/classUpdate';
import skillUpdate from '../controllers/skillUpdate/skillUpdate';
import subSkillUpdate from '../controllers/subSkillUpdate/subSkillUpdate';
import skillTaxonomyCreate from '../controllers/skillTaxonomyCreate/skillTaxonomyCreate';
import skillTaxonomySearch from '../controllers/skillTaxonomySearch/skillTaxonomySearch';

export const router = express.Router();

router.post('/tenant/create', setDataToRequestObject('api.tenant.create'), tenantCreate);

router.post('/tenant/update/:tenant_id', setDataToRequestObject('api.tenant.update'), tenantUpdate);

router.get('/tenant/read/:tenant_id', setDataToRequestObject('api.tenant.read'), readTeantById);

router.post('/tenant/search', setDataToRequestObject('api.tenant.search'), tenantSearch);

router.post('/master/create', setDataToRequestObject('api.master.create'), masterCreate);

router.post('/master/search', setDataToRequestObject('api.master.search'), masterSearch);

router.post('/bulk/upload/url', setDataToRequestObject('api.bulk.url'), getBulkUploadURL);

router.get('/bulk/template/read/:fileName', setDataToRequestObject('api.bulk.template'), getTemplate);

router.get('/bulk/upload/status/:process_id', setDataToRequestObject('api.bulk.status'), uploadStatus);

router.post('/board/update/:board_id', setDataToRequestObject('api.board.update'), boardUpdate);

router.post('/class/update/:class_id', setDataToRequestObject('api.class.update'), classUpdate);

router.post('/skill/update/:skill_id', setDataToRequestObject('api.skill.update'), skillUpdate);

router.post('/subSkill/update/:sub_skill_id', setDataToRequestObject('api.subskill.update'), subSkillUpdate);

router.post('/skillTaxonomy/create', setDataToRequestObject('api.skillTaxonomy.create'), skillTaxonomyCreate);

router.post('/skillTaxonomy/search', setDataToRequestObject('api.skillTaxonomy.search'), skillTaxonomySearch);
