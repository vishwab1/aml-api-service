import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { getBoard, updateBoard } from '../../services/board'; // Add corresponding functions in services
import { schemaValidation } from '../../services/validationService';
import logger from '../../utils/logger';
import boardUpdateJson from './updateBoardValidationSchema.json'; // Validation schema for board updates
import { ResponseHandler } from '../../utils/responseHandler';
import { amlError } from '../../types/amlError';
import { checkSkillTaxonomyIdsExists } from '../../services/skillTaxonomy';
import { checkClassIdsExists } from '../../services/class';

export const apiId = 'api.board.update';

//Function for board Update
const boardUpdate = async (req: Request, res: Response) => {
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

  // Validate skill taxonomy  existence
  const isTaxonomyIdsExists = await checkSkillTaxonomyIdsExists(dataBody.skill_taxonomy_ids);
  if (!isTaxonomyIdsExists) {
    const code = 'SKILL_TAXONOMY_NOT_EXISTS';
    throw amlError(code, 'Taxonomy Ids does not exist', 'NOT_FOUND', 404);
  }

  // Validate class  existence
  const isExists = await checkClassIdsExists(dataBody.class_ids.ids);
  if (!isExists) {
    const code = 'CLASS_ID_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: 'Class Id does not exist' });
    throw amlError(code, 'Class Id does not exists', 'NOT_FOUND', 404);
  }

  // Update the board
  await updateBoard(board_id, dataBody);

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Board Successfully Updated' } });
};

export default boardUpdate;
