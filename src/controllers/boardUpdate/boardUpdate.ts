import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { getBoard, updateBoardData } from '../../services/board';
import { schemaValidation } from '../../services/validationService';
import logger from '../../utils/logger';
import boardUpdateJson from './updateBoardValidationSchema.json';
import { ResponseHandler } from '../../utils/responseHandler';
import { amlError } from '../../types/amlError';
import { checkClassIdsExists } from '../../services/class';
import { checkSkillsExistByIds } from '../../services/skill';

export const apiId = 'api.board.update';

// Function for board Update
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
  const board = await getBoard(board_id);
  if (_.isEmpty(board)) {
    const code = 'BOARD_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: 'Board does not exist' });
    throw amlError(code, 'Board does not exist', 'NOT_FOUND', 404);
  }

  // Initialize updatedData with the current board data
  const updatedData = {
    ...board,
    ...dataBody,
  };

  // Handle `class_ids` separately to avoid overwriting the whole object
  if (dataBody.class_ids) {
    const { ids, l1_skill_ids } = dataBody.class_ids;

    // Ensure `class_ids` object exists in `updatedData`
    updatedData.class_ids = {
      ...board.class_ids, // Retain existing `class_ids` from board
    };

    // Handle merging `ids`
    if (ids) {
      const isExists = await checkClassIdsExists(ids);
      if (!isExists) {
        const code = 'CLASS_ID_NOT_EXISTS';
        logger.error({ code, apiId, msgid, resmsgid, message: 'Class ID does not exist' });
        throw amlError(code, 'Class ID does not exist', 'NOT_FOUND', 404);
      }
      // Update ids directly
      updatedData.class_ids.ids = ids; // Set ids directly
    }

    // Handle merging `l1_skill_ids`
    if (l1_skill_ids) {
      const isL1Exists = await checkSkillsExistByIds(l1_skill_ids);
      if (!isL1Exists) {
        const code = 'L1_SKILL_NOT_EXISTS';
        logger.error({ code, apiId, msgid, resmsgid, message: 'One or more L1 skills do not exist or are not of type l1_skill' });
        throw amlError(code, 'One or more L1 skills do not exist or are not of type l1_skill', 'NOT_FOUND', 404);
      }
      // Update l1_skill_ids directly
      updatedData.class_ids.l1_skill_ids = l1_skill_ids; // Set l1_skill_ids directly
    }
  }

  // Update the board data with the merged `class_ids`
  await updateBoardData(board_id, updatedData);

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Board Successfully Updated' } });
};

export default updateBoard;
