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
import getMediaUploadURL from '../controllers/media/mediaUpload';
import getMediaReadURL from '../controllers/media/mediaRead';
import { learnerRouter } from './entities/learnerRouter';
import getContentMediaReadURL from '../controllers/contentMedia/contentMedia';
import createQuestionSet from '../controllers/questionSetCreate/questionSetCreate';
import publishQuestionSet from '../controllers/questionSetPublish/questionSetPublish';
import readQuestionSetById from '../controllers/questionSetRead/questionSetRead';
import updateQuestionSetById from '../controllers/questionSetUpdate/questionSetUpdate';
import deleteQuestionSetById from '../controllers/questionSetDelete/questionSetDelete';
import discardQuestionSetById from '../controllers/questionSetDiscard/questionSetDiscard';
import { searchQuestionSets } from '../controllers/questionSetSearch/questionSetSearch';

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

router.post('/sub-skill/update/:sub_skill_id', setDataToRequestObject('api.subskill.update'), updateSubSkill);

router.post('/skill-taxonomy/create/:taxonomy_name', setDataToRequestObject('api.skillTaxonomy.create'), createSkillTaxonomy);

router.post('/skill-taxonomy/search', setDataToRequestObject('api.skillTaxonomy.search'), searchSkillTaxonomies);

router.post('/media/upload/presigned-url', setDataToRequestObject('api.media.upload'), getMediaUploadURL);

router.post('/media/read/presigned-url', setDataToRequestObject('api.media.read'), getMediaReadURL);

router.post('/content/media/read/presigned-url', setDataToRequestObject('api.contentMedia.read'), getContentMediaReadURL);

router.use('/learner', learnerRouter);

router.post('/question-set/create', setDataToRequestObject('api.questionSet.create'), createQuestionSet);

router.post('/question-set/publish/:question_set_id', setDataToRequestObject('api.questionSet.publish'), publishQuestionSet);

router.get('/question-set/read/:question_set__id', setDataToRequestObject('api.questionSet.read'), readQuestionSetById);

router.post('/question-set/update/:question_set__id', setDataToRequestObject('api.questionSet.update'), updateQuestionSetById);

router.post('/question-set/delete/:question_set_id', setDataToRequestObject('api.questionSet.delete'), deleteQuestionSetById);

router.post('/question-set/discard/:question_set__id', setDataToRequestObject('api.questionSet.discard'), discardQuestionSetById);

router.post('/question-set/search', setDataToRequestObject('api.questionSet.search'), searchQuestionSets);
