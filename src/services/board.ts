import { Op } from 'sequelize';
import { Status } from '../enums/status';
import { boardMaster } from '../models/boardMaster';

//get board by ids
export const getBoards = async (board_ids: number[]): Promise<any> => {
  const whereClause: Record<string, any> = { id: board_ids, is_active: true, status: Status.LIVE };
  const boards = await boardMaster.findAll({ where: whereClause, raw: true });
  return { boards };
};

//board name exists
export const checkBoardNameExists = async (boardName: string): Promise<boolean> => {
  const board = await boardMaster.findOne({
    where: {
      name: {
        [Op.contains]: { en: boardName },
      },
      status: Status.LIVE,
      is_active: true,
    },
  });
  return !!board;
};

//get board by id
export const getBoard = async (board_identifier: string): Promise<any> => {
  const board = await boardMaster.findOne({
    where: { identifier: board_identifier, is_active: true },
    raw: true,
  });
  return { board };
};

//update the board
export const updateBoardData = async (board_identifier: string, data: any): Promise<any> => {
  await boardMaster.update(data, {
    where: { identifier: board_identifier },
  });
};
