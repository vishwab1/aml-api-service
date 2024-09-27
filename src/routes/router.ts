import express from 'express';
import { setDataToRequestObject } from '../middlewares/setDataToReqObj';
import getBulkUploadURL from '../controllers/bulkUpload/bulkUpload';
import uploadStatus from '../controllers/bulkUpload/uploadStatus';
import getTemplate from '../controllers/template/getTemplate';
import createTenant from '../controllers/tenantCreate/tenantCreate';
import updateTenant from '../controllers/tenantUpdate/tenantUpdate';
import readTeantById from '../controllers/tenantRead/tenantRead';
import searchTenants from '../controllers/tenantSearch/tenantSearch';
import { createMaster } from '../controllers/masterCreate/masterCreate';
import { searchMasters } from '../controllers/masterSearch/masterSearch';
import updateBoard from '../controllers/boardUpdate/boardUpdate';
import updateSkill from '../controllers/skillUpdate/skillUpdate';
import createSkillTaxonomy from '../controllers/skillTaxonomyCreate/skillTaxonomyCreate';
import searchSkillTaxonomies from '../controllers/skillTaxonomySearch/skillTaxonomySearch';
import updateClass from '../controllers/classUpdate/classUpdate';
import updateSubSkill from '../controllers/subSkillUpdate/subSkillUpdate';

export const router = express.Router();

router.post('/tenant/create', setDataToRequestObject('api.tenant.create'), createTenant);

router.post('/tenant/update/:tenant_id', setDataToRequestObject('api.tenant.update'), updateTenant);

router.get('/tenant/read/:tenant_id', setDataToRequestObject('api.tenant.read'), readTeantById);

router.post('/tenant/search', setDataToRequestObject('api.tenant.search'), searchTenants);

router.post('/master/create', setDataToRequestObject('api.master.create'), createMaster);

router.post('/master/search', setDataToRequestObject('api.master.search'), searchMasters);

router.post('/bulk/upload/url', setDataToRequestObject('api.bulk.url'), getBulkUploadURL);

router.get('/bulk/template/read/:fileName', setDataToRequestObject('api.bulk.template'), getTemplate);

router.get('/bulk/upload/status/:process_id', setDataToRequestObject('api.bulk.status'), uploadStatus);

router.post('/board/update/:board_id', setDataToRequestObject('api.board.update'), updateBoard);

router.post('/class/update/:class_id', setDataToRequestObject('api.class.update'), updateClass);

router.post('/skill/update/:skill_id', setDataToRequestObject('api.skill.update'), updateSkill);

router.post('/subSkill/update/:sub_skill_id', setDataToRequestObject('api.subskill.update'), updateSubSkill);

router.post('/skillTaxonomy/create/:taxonomy_name', setDataToRequestObject('api.skillTaxonomy.create'), createSkillTaxonomy);

router.post('/skillTaxonomy/search', setDataToRequestObject('api.skillTaxonomy.search'), searchSkillTaxonomies);
