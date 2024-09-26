import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { getBoard, updateBoardData } from '../../services/board'; // Add corresponding functions in services
import { schemaValidation } from '../../services/validationService';
import logger from '../../utils/logger';
import boardUpdateJson from './updateBoardValidationSchema.json'; // Validation schema for board updates
import { ResponseHandler } from '../../utils/responseHandler';
import { amlError } from '../../types/amlError';
import { checkSkillTaxonomyIdsExists } from '../../services/skillTaxonomy';
import { checkClassIdsExists } from '../../services/class';
import { checkSkillsExistByIds } from '../../services/skill';

export const apiId = 'api.board.update';

//Function for board Update
const updateBoard = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');
  const board_id = _.get(req, 'params.board_id');
  const dataBody = _.get(req, 'body.request');

  // Validate request body
  const isRequestValid = schemaValidation(requestBody, boardUpdateJson);
  if (!isRequestValid.isValid) {
    const code = 'BOARD_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  // Validate board existence
  const { board } = await getBoard(board_id);
  if (_.isEmpty(board)) {
    const code = 'BOARD_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: 'Board does not exist' });
    throw amlError(code, 'Board does not exists', 'NOT_FOUND', 404);
  }

  // Validate skill taxonomy existence if present
  if (dataBody.skill_taxonomy_ids && dataBody.skill_taxonomy_ids.length > 0) {
    const isTaxonomyIdsExists = await checkSkillTaxonomyIdsExists(dataBody.skill_taxonomy_ids);
    if (!isTaxonomyIdsExists) {
      const code = 'SKILL_TAXONOMY_NOT_EXISTS';
      throw amlError(code, 'Taxonomy Ids do not exist', 'NOT_FOUND', 404);
    }
  }

  // Validate class existence if present
  if (dataBody.class_ids && dataBody.class_ids.ids && dataBody.class_ids.ids.length > 0) {
    const isExists = await checkClassIdsExists(dataBody.class_ids.ids);
    if (!isExists) {
      const code = 'CLASS_ID_NOT_EXISTS';
      logger.error({ code, apiId, msgid, resmsgid, message: 'Class Id does not exist' });
      throw amlError(code, 'Class Id does not exist', 'NOT_FOUND', 404);
    }
  }

  // Check if l1_skill exists in skill_master and is of type l1_skill
  if (dataBody.class_ids && dataBody.class_ids.l1_skill && dataBody.class_ids.l1_skill.length > 0) {
    const l1SkillIds = dataBody.class_ids.l1_skill;

    // Validate if l1_skill IDs exist and their type is 'l1_skill'
    const isL1Exists = await checkSkillsExistByIds(l1SkillIds); // Check for 'l1_skill' type
    if (!isL1Exists) {
      const code = 'L1_SKILL_NOT_EXISTS';
      logger.error({ code, apiId, msgid, resmsgid, message: 'One or more L1 skills do not exist or are not of type l1_skill' });
      throw amlError(code, 'One or more L1 skills do not exist or are not of type l1_skill', 'NOT_FOUND', 404);
    }
  }

  // Update the board
  await updateBoardData(board_id, dataBody);

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Board Successfully Updated' } });
};

export default updateBoard;
